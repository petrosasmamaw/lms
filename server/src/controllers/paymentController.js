import {
  getMyPayments,
  getStudentPayments,
  updatePaymentStatus,
  getPaymentById,
  isValidStatus,
  submitStudentPayment,
  PaymentSubmissionError,
} from '../services/paymentService.js';
import { getPublicPaymentConfig } from '../config/paymentConfig.js';
import { success, error } from '../utils/response.js';

function parseYear(value) {
  const year = Number(value) || new Date().getFullYear();
  if (year < 2000 || year > 2100) return new Date().getFullYear();
  return year;
}

export async function getMyPaymentRecords(req, res) {
  try {
    const year = parseYear(req.query.year);
    const result = await getMyPayments(req.userId, year);
    if (!result) return error(res, 'Student not found', 404);
    return success(res, result, 'Payments retrieved');
  } catch (err) {
    return error(res, 'Failed to load payments', 500, err.message);
  }
}

export async function getStudentPaymentRecords(req, res) {
  try {
    const { studentId } = req.params;
    const year = parseYear(req.query.year);
    const result = await getStudentPayments(studentId, year);
    if (!result) return error(res, 'Student not found', 404);
    return success(res, result, 'Student payments retrieved');
  } catch (err) {
    return error(res, 'Failed to load student payments', 500, err.message);
  }
}

export async function getPaymentConfig(req, res) {
  try {
    return success(res, getPublicPaymentConfig(), 'Payment config');
  } catch (err) {
    return error(res, 'Failed to load payment config', 500, err.message);
  }
}

export async function submitPayment(req, res) {
  try {
    const { id } = req.params;
    if (!req.file) return error(res, 'Screenshot image is required', 400);

    const method = String(req.body.method || '').toLowerCase();
    const form = {
      senderName: req.body.senderName?.trim(),
      senderAccount: req.body.senderAccount?.trim(),
      receiverName: req.body.receiverName?.trim(),
      receiverAccount: req.body.receiverAccount?.trim(),
      amount: req.body.amount,
      transactionCode: req.body.transactionCode?.trim(),
      paymentDate: req.body.paymentDate?.trim() || null,
    };

    if (!form.senderName || !form.senderAccount || !form.receiverName
      || !form.receiverAccount || !form.amount || !form.transactionCode) {
      return error(res, 'All payment fields are required', 400);
    }

    const result = await submitStudentPayment({
      paymentId: Number(id),
      studentId: req.userId,
      method,
      form,
      screenshotPath: req.file.path,
    });

    return success(res, result, result.message, 200);
  } catch (err) {
    if (err instanceof PaymentSubmissionError) {
      const details = err.details || {};
      return res.status(err.status).json({
        success: false,
        message: err.message,
        data: {
          ...details,
          issues: details.issues || details.validation?.issues?.filter((i) => i.type === 'error') || [],
        },
      });
    }
    return error(res, 'Payment submission failed', 500, err.message);
  }
}

export async function patchPaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidStatus(status)) {
      return error(res, 'status must be unpaid, pending, or complete', 400);
    }

    const payment = await getPaymentById(Number(id));
    if (!payment) return error(res, 'Payment not found', 404);

    const updated = await updatePaymentStatus(Number(id), status);
    return success(res, { payment: updated }, 'Payment status updated');
  } catch (err) {
    return error(res, 'Failed to update payment', 500, err.message);
  }
}
