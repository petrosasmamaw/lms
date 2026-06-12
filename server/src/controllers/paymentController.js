import {
  getMyPayments,
  getStudentPayments,
  updatePaymentStatus,
  getPaymentById,
  isValidStatus,
} from '../services/paymentService.js';
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
