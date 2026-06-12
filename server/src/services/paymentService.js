import fs from 'fs/promises';
import cloudinary from '../config/cloudinary.js';
import { db } from '../db/index.js';
import { studentPayments } from '../db/schema.js';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getUserById } from './userService.js';
import { extractPaymentFromScreenshot } from './geminiService.js';
import { decodeQrFromImage } from './qrService.js';
import { validatePaymentSubmission, buildDuplicateTxIssue } from './paymentValidationService.js';

const VALID_STATUSES = ['unpaid', 'pending', 'complete'];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

async function ensureYearPayments(studentId, year) {
  const existing = await db.query.studentPayments.findMany({
    where: and(
      eq(studentPayments.studentId, studentId),
      eq(studentPayments.year, year),
    ),
  });

  const existingMonths = new Set(existing.map((p) => p.month));
  const missing = MONTHS.filter((m) => !existingMonths.has(m));

  if (missing.length) {
    const now = new Date();
    await db.insert(studentPayments).values(
      missing.map((month) => ({
        studentId,
        year,
        month,
        status: 'unpaid',
        createdAt: now,
        updatedAt: now,
      })),
    );
  }

  return db.query.studentPayments.findMany({
    where: and(
      eq(studentPayments.studentId, studentId),
      eq(studentPayments.year, year),
    ),
    orderBy: [asc(studentPayments.month)],
  });
}

export async function getStudentPayments(studentId, year) {
  const profile = await getUserById(studentId);
  if (!profile || profile.role !== 'student') {
    return null;
  }

  const payments = await ensureYearPayments(studentId, year);
  return { student: profile, payments, year };
}

export async function getMyPayments(userId, year) {
  return getStudentPayments(userId, year);
}

export async function updatePaymentStatus(paymentId, status) {
  if (!isValidStatus(status)) {
    throw new Error('Invalid payment status');
  }

  const [updated] = await db
    .update(studentPayments)
    .set({ status, updatedAt: new Date() })
    .where(eq(studentPayments.id, paymentId))
    .returning();

  return updated || null;
}

export async function getPaymentById(paymentId) {
  return db.query.studentPayments.findFirst({
    where: eq(studentPayments.id, paymentId),
  });
}

export async function findPaymentByTxCode(txCode, excludePaymentId) {
  if (!txCode) return null;
  return db.query.studentPayments.findFirst({
    where: and(
      eq(studentPayments.txCode, txCode),
      ne(studentPayments.id, excludePaymentId),
    ),
  });
}

export class PaymentSubmissionError extends Error {
  constructor(message, status = 400, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function cleanupTempFile(filePath) {
  if (!filePath) return;
  await fs.unlink(filePath).catch(() => {});
}

export async function submitStudentPayment({
  paymentId,
  studentId,
  method,
  form,
  screenshotPath,
}) {
  const payment = await getPaymentById(paymentId);
  if (!payment) throw new PaymentSubmissionError('Payment not found', 404);
  if (payment.studentId !== studentId) {
    throw new PaymentSubmissionError('You can only submit your own payments', 403);
  }
  if (payment.status === 'complete') {
    throw new PaymentSubmissionError('This month is already paid', 400);
  }
  if (!['telebirr', 'cbe'].includes(method)) {
    throw new PaymentSubmissionError('Payment method must be telebirr or cbe', 400);
  }

  let extracted = null;
  let qrData = null;
  let screenshotUrl = null;

  try {
    const uploadResult = await cloudinary.uploader.upload(screenshotPath, {
      folder: 'lms/payments',
      resource_type: 'image',
    });
    screenshotUrl = uploadResult.secure_url;

    let geminiUsed = true;
    let geminiError = null;
    try {
      extracted = await extractPaymentFromScreenshot(screenshotPath);
    } catch (err) {
      geminiError = err.message;
      console.warn('[Gemini]', geminiError);
      geminiUsed = false;
      extracted = {
        senderName: null,
        senderAccount: null,
        receiverName: null,
        receiverAccount: null,
        amount: null,
        date: form.paymentDate || null,
        transactionCode: null,
      };
    }

    qrData = await decodeQrFromImage(screenshotPath);
    if (qrData?.transactionCode) {
      console.log('[QR] Invoice from QR:', qrData.transactionCode);
    }

    const validation = validatePaymentSubmission({
      payment,
      method,
      form,
      extracted,
      qrData,
      geminiUsed,
      geminiError,
    });

    const now = new Date();
    const baseUpdate = {
      paymentMethod: method,
      senderName: form.senderName,
      senderAccount: form.senderAccount,
      receiverName: form.receiverName,
      receiverAccount: form.receiverAccount,
      amount: String(form.amount),
      screenshotUrl,
      submittedAt: now,
      updatedAt: now,
      rejectionReason: null,
    };

    if (validation.txCode) {
      const duplicate = await findPaymentByTxCode(validation.txCode, paymentId);
      if (duplicate) {
        const dupIssue = buildDuplicateTxIssue(validation.txCode, duplicate);
        const dupValidation = {
          ...validation,
          passed: false,
          issues: [dupIssue, ...validation.issues],
          errors: [dupIssue.message, ...validation.errors],
        };
        throw new PaymentSubmissionError(dupIssue.message, 409, {
          validation: dupValidation,
          issues: dupValidation.issues,
        });
      }
    }

    if (validation.passed) {
      try {
        const [updated] = await db
          .update(studentPayments)
          .set({
            ...baseUpdate,
            status: 'complete',
            txCode: validation.txCode,
          })
          .where(eq(studentPayments.id, paymentId))
          .returning();

        return {
          payment: updated,
          status: 'complete',
          message: validation.warnings.length
            ? 'Payment verified and marked complete (with warnings)'
            : 'Payment verified and marked complete',
          validation,
          issues: validation.issues,
        };
      } catch (err) {
        if (err.code === '23505') {
          const dupIssue = buildDuplicateTxIssue(validation.txCode, null);
          throw new PaymentSubmissionError(dupIssue.message, 409, {
            issues: [dupIssue],
            validation: { passed: false, issues: [dupIssue], errors: [dupIssue.message] },
          });
        }
        throw err;
      }
    }

    const reason = validation.errors.join('. ');
    const [pending] = await db
      .update(studentPayments)
      .set({
        ...baseUpdate,
        status: 'pending',
        txCode: validation.txCode || null,
        rejectionReason: reason,
      })
      .where(eq(studentPayments.id, paymentId))
      .returning();

    throw new PaymentSubmissionError(
      validation.errors[0] || 'Payment could not be auto-verified',
      422,
      {
        payment: pending,
        validation,
        issues: validation.issues.filter((i) => i.type === 'error'),
      },
    );
  } finally {
    await cleanupTempFile(screenshotPath);
  }
}
