import { getPaymentConfig } from '../config/paymentConfig.js';

function issue(type, code, field, message, extra = {}) {
  return { type, code, field, message, ...extra };
}

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeAccount(value) {
  const raw = String(value || '').trim();
  const digitParts = raw.replace(/[^\d*]/g, '').split('*').filter(Boolean);
  if (digitParts.length >= 2) {
    let combined = digitParts.join('');
    if (combined.startsWith('251') && combined.length >= 10) {
      return `0${combined.slice(3)}`;
    }
    return combined;
  }

  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('251') && digits.length >= 12) {
    digits = `0${digits.slice(3)}`;
  }
  return digits;
}

function normalizeTxCode(value) {
  return String(value || '').replace(/\s+/g, '').toUpperCase();
}

function namesMatch(a, b) {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return false;
  if (na === nb || na.includes(nb) || nb.includes(na)) return true;
  const wordsA = na.split(' ').filter((w) => w.length > 2);
  const wordsB = nb.split(' ').filter((w) => w.length > 2);
  const overlap = wordsA.filter((w) => wordsB.some((b) => b.includes(w) || w.includes(b)));
  return overlap.length >= Math.min(2, Math.min(wordsA.length, wordsB.length));
}

function accountsMatch(a, b) {
  const aa = normalizeAccount(a);
  const ab = normalizeAccount(b);
  if (!aa || !ab) return false;
  if (aa === ab) return true;
  if (aa.endsWith(ab) || ab.endsWith(aa)) return true;
  if (aa.length >= 4 && ab.length >= 4 && aa.slice(-4) === ab.slice(-4)) return true;
  return false;
}

function amountsMatchFee(paid, fee) {
  const p = Number(String(paid).replace(/,/g, ''));
  const f = Number(fee);
  if (Number.isNaN(p) || Number.isNaN(f)) return false;
  if (Math.abs(p - f) <= 1) return true;
  if (p >= f && p <= f + 20) return true;
  return false;
}

export function parsePaymentDate(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim().split(' ')[0];

  const dmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const d = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
    if (!Number.isNaN(d.getTime())) return d;
  }

  const ymd = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) {
    const d = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    if (!Number.isNaN(d.getTime())) return d;
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function dateInBillingMonth(dateStr, year, month) {
  const d = parsePaymentDate(dateStr);
  if (!d) return false;
  return d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month);
}

/** Strict match — DFC7TG1O11 and DFC7TG1O112 must NOT pass as equal. */
function txCodesMatch(a, b) {
  const na = normalizeTxCode(a);
  const nb = normalizeTxCode(b);
  if (!na || !nb) return false;
  return na === nb;
}

function allTxCodesMatch(...candidates) {
  const codes = candidates.map(normalizeTxCode).filter(Boolean);
  if (codes.length <= 1) return true;
  return codes.every((c) => c === codes[0]);
}

export function validatePaymentSubmission({
  payment,
  method,
  form,
  extracted,
  qrData,
  geminiUsed = true,
  geminiError = null,
}) {
  const config = getPaymentConfig();
  const issues = [];

  const expectedReceiverAccount = method === 'telebirr'
    ? config.telebirr.receiverAccount
    : config.cbe.receiverAccount;

  if (!expectedReceiverAccount) {
    issues.push(issue('error', 'CONFIG_MISSING', 'receiverAccount',
      `School ${method} receiver account is not configured. Contact your administrator.`));
  }

  if (!form.transactionCode?.trim()) {
    issues.push(issue('error', 'TX_CODE_REQUIRED', 'transactionCode',
      'Transaction / invoice number is required.'));
  }

  if (!namesMatch(form.receiverName, config.receiverName)) {
    issues.push(issue('error', 'RECEIVER_NAME_MISMATCH', 'receiverName',
      `Receiver name you entered ("${form.receiverName}") does not match the school account ("${config.receiverName}").`,
      { formValue: form.receiverName, expected: config.receiverName }));
  }

  if (geminiUsed && extracted?.receiverName && !namesMatch(extracted.receiverName, config.receiverName)) {
    issues.push(issue('error', 'SCREENSHOT_RECEIVER_NAME', 'receiverName',
      `Receiver name on screenshot ("${extracted.receiverName}") does not match the school account ("${config.receiverName}").`,
      { screenshotValue: extracted.receiverName, expected: config.receiverName }));
  }

  if (!accountsMatch(form.receiverAccount, expectedReceiverAccount)) {
    issues.push(issue('error', 'RECEIVER_ACCOUNT_MISMATCH', 'receiverAccount',
      `Receiver account you entered ("${form.receiverAccount}") does not match the school account ("${expectedReceiverAccount}").`,
      { formValue: form.receiverAccount, expected: expectedReceiverAccount }));
  }

  if (geminiUsed && extracted?.receiverAccount && !accountsMatch(extracted.receiverAccount, expectedReceiverAccount)) {
    issues.push(issue('error', 'SCREENSHOT_RECEIVER_ACCOUNT', 'receiverAccount',
      `Receiver account on screenshot ("${extracted.receiverAccount}") does not match the school account ("${expectedReceiverAccount}").`,
      { screenshotValue: extracted.receiverAccount, expected: expectedReceiverAccount }));
  }

  if (!amountsMatchFee(form.amount, config.monthlyFee)) {
    issues.push(issue('error', 'FORM_AMOUNT_MISMATCH', 'amount',
      `Amount you entered (${form.amount} ETB) does not equal the monthly fee (${config.monthlyFee} ETB). Use the settled amount, not total with fees.`,
      { formValue: form.amount, expected: config.monthlyFee }));
  }

  if (geminiUsed && extracted?.amount != null && !amountsMatchFee(extracted.amount, config.monthlyFee)) {
    issues.push(issue('error', 'SCREENSHOT_AMOUNT_MISMATCH', 'amount',
      `Amount on screenshot (${extracted.amount} ETB) does not equal the monthly fee (${config.monthlyFee} ETB).`,
      { screenshotValue: extracted.amount, expected: config.monthlyFee }));
  }

  if (geminiUsed && form.amount && extracted?.amount != null
    && !amountsMatchFee(form.amount, extracted.amount) && amountsMatchFee(form.amount, config.monthlyFee)) {
    issues.push(issue('error', 'AMOUNT_FORM_SCREENSHOT_MISMATCH', 'amount',
      `Amount you entered (${form.amount} ETB) does not match the amount on screenshot (${extracted.amount} ETB).`,
      { formValue: form.amount, screenshotValue: extracted.amount }));
  }

  const paymentDate = extracted?.date || form.paymentDate;
  if (paymentDate && !dateInBillingMonth(paymentDate, payment.year, payment.month)) {
    const billing = `${payment.year}-${String(payment.month).padStart(2, '0')}`;
    issues.push(issue('error', 'DATE_MISMATCH', 'paymentDate',
      `Payment date (${paymentDate}) is not in the billing month (${billing}). Pay for the correct month.`,
      { formValue: form.paymentDate, screenshotValue: extracted?.date, expected: billing }));
  } else if (!paymentDate && geminiUsed) {
    issues.push(issue('warning', 'DATE_NOT_READ', 'paymentDate',
      'Could not read payment date from screenshot. Enter the date manually on the form.'));
  }

  const formTx = normalizeTxCode(form.transactionCode);
  const screenshotTx = normalizeTxCode(extracted?.transactionCode);
  const qrTx = normalizeTxCode(qrData?.transactionCode);

  if (method === 'telebirr' && !qrTx) {
    issues.push(issue('error', 'QR_UNREADABLE', 'transactionCode',
      'Could not read the QR code on your Telebirr receipt. Upload a clear, uncropped screenshot with the QR visible at the bottom.',
      { qrValue: null }));
  }

  if (qrTx && screenshotTx && !txCodesMatch(qrTx, screenshotTx)) {
    issues.push(issue('error', 'FRAUD_EDITED_RECEIPT', 'transactionCode',
      `Receipt may be edited — screenshot shows invoice "${screenshotTx}" but the QR code proves "${qrTx}". These must match exactly.`,
      { screenshotValue: screenshotTx, qrValue: qrTx }));
  }

  if (qrTx && formTx && !txCodesMatch(qrTx, formTx)) {
    issues.push(issue('error', 'TX_FORM_QR_MISMATCH', 'transactionCode',
      `Transaction code you entered ("${formTx}") does not match the QR code ("${qrTx}").`,
      { formValue: formTx, qrValue: qrTx }));
  }

  if (geminiUsed && screenshotTx && formTx && !txCodesMatch(screenshotTx, formTx)) {
    issues.push(issue('error', 'TX_FORM_SCREENSHOT_MISMATCH', 'transactionCode',
      `Transaction code you entered ("${formTx}") does not match the screenshot ("${screenshotTx}").`,
      { formValue: formTx, screenshotValue: screenshotTx }));
  }

  if (qrTx && screenshotTx && formTx && !allTxCodesMatch(formTx, screenshotTx, qrTx)) {
    issues.push(issue('error', 'TX_CODE_MISMATCH', 'transactionCode',
      `Form ("${formTx}"), screenshot ("${screenshotTx}"), and QR ("${qrTx}") must all be identical.`,
      { formValue: formTx, screenshotValue: screenshotTx, qrValue: qrTx }));
  }

  const txCode = qrTx || screenshotTx || formTx;

  if (!txCode) {
    issues.push(issue('error', 'TX_CODE_INVALID', 'transactionCode',
      'Could not determine a valid transaction code from your form, screenshot, or QR code.'));
  }

  if (geminiUsed && extracted?.senderName && form.senderName && !namesMatch(form.senderName, extracted.senderName)) {
    issues.push(issue('error', 'SENDER_NAME_MISMATCH', 'senderName',
      `Sender name you entered ("${form.senderName}") does not match the screenshot ("${extracted.senderName}").`,
      { formValue: form.senderName, screenshotValue: extracted.senderName }));
  }

  if (geminiUsed && extracted?.senderAccount && form.senderAccount && !accountsMatch(form.senderAccount, extracted.senderAccount)) {
    issues.push(issue('error', 'SENDER_ACCOUNT_MISMATCH', 'senderAccount',
      `Sender account you entered ("${form.senderAccount}") does not match the screenshot ("${extracted.senderAccount}").`,
      { formValue: form.senderAccount, screenshotValue: extracted.senderAccount }));
  }

  if (!geminiUsed) {
    const aiMsg = geminiError || 'AI screenshot reading was unavailable.';
    issues.push(issue('warning', 'AI_UNAVAILABLE', null,
      `${aiMsg} Cross-checking form against QR code.`));
  }

  if (qrTx && geminiUsed && screenshotTx && txCodesMatch(qrTx, screenshotTx) && txCodesMatch(qrTx, formTx)) {
    issues.push(issue('warning', 'QR_VERIFIED', 'transactionCode',
      `QR code verified — invoice ${qrTx} matches your form and screenshot.`));
  }

  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');

  const hasFraud = errors.some((i) => i.code === 'FRAUD_EDITED_RECEIPT');
  const filteredErrors = hasFraud
    ? errors.filter((i) => !['TX_FORM_QR_MISMATCH', 'TX_CODE_MISMATCH', 'TX_FORM_SCREENSHOT_MISMATCH'].includes(i.code))
    : errors;

  return {
    passed: filteredErrors.length === 0,
    needsReview: filteredErrors.length > 0,
    txCode,
    issues,
    errors: filteredErrors.map((i) => i.message),
    warnings: warnings.map((i) => i.message),
    extracted,
    qrData,
    geminiUsed,
  };
}

export function buildDuplicateTxIssue(txCode, existingPayment) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const usedFor = existingPayment
    ? `${monthNames[existingPayment.month - 1]} ${existingPayment.year}`
    : 'another payment';
  return issue('error', 'DUPLICATE_TX', 'transactionCode',
    `Transaction number "${txCode}" was already used for ${usedFor}. Each receipt can only be submitted once.`,
    { actual: txCode, usedFor });
}
