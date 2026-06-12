import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'

const FIELD_LABELS = {
  senderName: 'Sender name',
  senderAccount: 'Sender account',
  receiverName: 'Receiver name',
  receiverAccount: 'Receiver account',
  amount: 'Amount',
  transactionCode: 'Transaction code',
  paymentDate: 'Payment date',
}

const CODE_LABELS = {
  FRAUD_EDITED_RECEIPT: 'Edited receipt detected',
  DUPLICATE_TX: 'Duplicate transaction',
  QR_UNREADABLE: 'QR code not readable',
  TX_FORM_QR_MISMATCH: 'Form vs QR mismatch',
  TX_FORM_SCREENSHOT_MISMATCH: 'Form vs screenshot mismatch',
  SCREENSHOT_AMOUNT_MISMATCH: 'Amount mismatch',
  SENDER_NAME_MISMATCH: 'Sender name mismatch',
}

export function PaymentFailureList({ issues = [], title = 'Payment could not be verified' }) {
  if (!issues.length) return null

  return (
    <div className="payment-verify-fail">
      <div className="payment-verify-fail-header">
        <AlertCircle size={18} strokeWidth={1.5} aria-hidden="true" />
        <p className="font-medium">{title}</p>
      </div>
      <ul className="payment-verify-list">
        {issues.map((item, idx) => (
          <li key={item.code || idx} className="payment-verify-item payment-verify-item-error">
            <span className="payment-verify-item-label">
              {CODE_LABELS[item.code] || FIELD_LABELS[item.field] || item.code?.replace(/_/g, ' ') || 'Error'}
            </span>
            <p className="payment-verify-item-msg">{item.message}</p>
            {(item.formValue != null || item.screenshotValue != null || item.qrValue != null || item.expected != null) && (
              <dl className="payment-verify-compare">
                {item.formValue != null && (
                  <>
                    <dt>You entered</dt>
                    <dd className="font-mono">{item.formValue}</dd>
                  </>
                )}
                {item.screenshotValue != null && (
                  <>
                    <dt>Screenshot shows</dt>
                    <dd className="font-mono">{item.screenshotValue}</dd>
                  </>
                )}
                {item.qrValue != null && (
                  <>
                    <dt>QR code proves</dt>
                    <dd className="font-mono">{item.qrValue}</dd>
                  </>
                )}
                {item.expected != null && (
                  <>
                    <dt>Expected</dt>
                    <dd className="font-mono">{item.expected}</dd>
                  </>
                )}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PaymentWarningList({ issues = [] }) {
  const warnings = issues.filter((i) => i.type === 'warning')
  if (!warnings.length) return null

  return (
    <div className="payment-verify-warn">
      <div className="payment-verify-fail-header">
        <AlertTriangle size={18} strokeWidth={1.5} aria-hidden="true" />
        <p className="font-medium">Notes</p>
      </div>
      <ul className="payment-verify-list">
        {warnings.map((item, idx) => (
          <li key={item.code || idx} className="payment-verify-item payment-verify-item-warn">
            <p className="payment-verify-item-msg">{item.message}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PaymentSuccessNote({ message }) {
  if (!message) return null
  return (
    <div className="payment-verify-success">
      <CheckCircle2 size={18} strokeWidth={1.5} aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}
