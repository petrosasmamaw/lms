import { db } from '../db/index.js';
import { studentPayments } from '../db/schema.js';
import { and, asc, eq } from 'drizzle-orm';
import { getUserById } from './userService.js';

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
