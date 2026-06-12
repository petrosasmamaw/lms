import { useEffect, useState } from 'react'
import axios from '../api/axiosInstance'
import { unwrap } from '../api/unwrap'
import { X, Upload, Smartphone, Building2, CheckCircle2 } from 'lucide-react'
import { MONTH_NAMES } from '../lib/payments'
import { PaymentFailureList, PaymentWarningList } from './PaymentVerificationResult'

const METHODS = [
  { id: 'telebirr', label: 'Telebirr', icon: Smartphone, desc: 'Pay via Telebirr mobile money' },
  { id: 'cbe', label: 'CBE Birr', icon: Building2, desc: 'Pay via Commercial Bank of Ethiopia' },
]

export default function PaymentSubmitModal({ payment, calendarYear, onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('')
  const [config, setConfig] = useState(null)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [failureIssues, setFailureIssues] = useState([])
  const [preview, setPreview] = useState(null)
  const today = new Date()
  const defaultDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`

  const [form, setForm] = useState({
    senderName: '',
    senderAccount: '',
    receiverName: '',
    receiverAccount: '',
    amount: '',
    transactionCode: '',
    paymentDate: defaultDate,
  })
  const [screenshot, setScreenshot] = useState(null)

  useEffect(() => {
    axios
      .get('/payments/config')
      .then((res) => setConfig(unwrap(res)))
      .catch(() => setConfig(null))
      .finally(() => setLoadingConfig(false))
  }, [])

  useEffect(() => {
    if (!method || !config) return
    const m = config.methods?.[method]
    if (!m) return
    setForm((prev) => ({
      ...prev,
      receiverName: m.receiverName || config.receiverName || '',
      receiverAccount: m.receiverAccount || '',
      amount: String(config.monthlyFee || ''),
    }))
  }, [method, config])

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshot(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!screenshot) {
      setFailureIssues([{ code: 'SCREENSHOT_REQUIRED', field: 'screenshot', message: 'Please upload your payment screenshot.' }])
      return
    }

    setSubmitting(true)
    setFailureIssues([])

    const body = new FormData()
    body.append('screenshot', screenshot)
    body.append('method', method)
    body.append('senderName', form.senderName)
    body.append('senderAccount', form.senderAccount)
    body.append('receiverName', form.receiverName)
    body.append('receiverAccount', form.receiverAccount)
    body.append('amount', form.amount)
    body.append('transactionCode', form.transactionCode)
    body.append('paymentDate', form.paymentDate)

    try {
      const res = await axios.post(`/payments/${payment.id}/submit`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const data = unwrap(res)
      onSuccess(data.payment, { issues: data.issues || data.validation?.issues || [] })
    } catch (err) {
      const data = err.response?.data?.data
      const issues = data?.issues || data?.validation?.issues?.filter((i) => i.type === 'error') || []
      setFailureIssues(issues)
      if (data?.payment) {
        onSuccess(data.payment, { issues: data.validation?.issues || issues, failed: true })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const monthLabel = MONTH_NAMES[payment.month - 1]

  return (
    <div className="payment-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="payment-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="payment-modal-title"
      >
        <header className="payment-modal-header">
          <div>
            <p className="eyebrow">Submit payment</p>
            <h2 id="payment-modal-title" className="section-title mt-1">
              {monthLabel} {calendarYear}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="btn-icon" aria-label="Close">
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="payment-modal-steps">
          {['Method', 'Details', 'Screenshot'].map((label, i) => (
            <div key={label} className={`payment-modal-step ${step >= i + 1 ? 'payment-modal-step-active' : ''}`}>
              <span className="payment-modal-step-num">{i + 1}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {loadingConfig && (
          <div className="flex items-center justify-center py-16 gap-3">
            <span className="spinner" />
            <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Loading…</span>
          </div>
        )}

        {!loadingConfig && step === 1 && (
          <div className="payment-modal-body">
            <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-4">
              Choose how you paid for {monthLabel}.
            </p>
            <div className="payment-method-grid">
              {METHODS.map((m) => {
                const Icon = m.icon
                const active = method === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`payment-method-card ${active ? 'payment-method-card-active' : ''}`}
                  >
                    <div className="payment-method-icon">
                      <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <p className="font-semibold">{m.label}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)] mt-1">{m.desc}</p>
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              className="btn-primary w-full mt-6"
              disabled={!method}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        )}

        {!loadingConfig && step === 2 && (
          <form
            className="payment-modal-body space-y-4"
            onSubmit={(e) => { e.preventDefault(); setStep(3) }}
          >
            <div className="payment-info-box">
              <p className="text-[var(--text-sm)] font-medium">Pay to this account</p>
              <p className="font-mono text-[var(--text-sm)] mt-1">{form.receiverName}</p>
              <p className="font-mono text-lg font-semibold text-[var(--color-accent)] mt-1">
                {form.receiverAccount}
              </p>
              <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)] mt-2">
                Settled amount: <span className="font-mono font-semibold">{form.amount} ETB</span>
                <span className="block mt-1">Use settled amount, not total with fees</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="senderName">Your name (sender)</label>
                <input id="senderName" className="input" value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="senderAccount">Your account (sender)</label>
                <input id="senderAccount" className="input font-mono" value={form.senderAccount} onChange={(e) => setForm({ ...form, senderAccount: e.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="receiverName">Receiver name</label>
                <input id="receiverName" className="input" value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="receiverAccount">Receiver account</label>
                <input id="receiverAccount" className="input font-mono" value={form.receiverAccount} onChange={(e) => setForm({ ...form, receiverAccount: e.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="amount">Amount (ETB)</label>
                <input id="amount" type="number" step="0.01" className="input font-mono" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="transactionCode">Invoice / transaction code</label>
                <input id="transactionCode" className="input font-mono" value={form.transactionCode} onChange={(e) => setForm({ ...form, transactionCode: e.target.value })} placeholder="e.g. DFC7TG1O11" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="paymentDate">Payment date (DD-MM-YYYY)</label>
                <input id="paymentDate" className="input font-mono" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} placeholder="12-06-2026" required />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-ghost flex-1" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="btn-primary flex-1">Continue</button>
            </div>
          </form>
        )}

        {!loadingConfig && step === 3 && (
          <form className="payment-modal-body" onSubmit={handleSubmit}>
            <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-4">
              Upload a clear screenshot with the <strong>QR code visible at the bottom</strong>. We scan the QR, read the receipt with AI, and reject edited/fake receipts.
            </p>

            <label className={`payment-upload-zone ${preview ? 'payment-upload-zone-filled' : ''}`}>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="sr-only" required />
              {preview ? (
                <img src={preview} alt="Payment screenshot preview" className="payment-upload-preview" />
              ) : (
                <>
                  <Upload size={28} strokeWidth={1.5} className="text-[var(--color-text-tertiary)]" />
                  <p className="font-medium mt-3">Drop or click to upload</p>
                  <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">JPG, PNG, or WEBP · max 10 MB</p>
                </>
              )}
            </label>

            {failureIssues.length > 0 && (
              <div className="mt-4">
                <PaymentFailureList issues={failureIssues} />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button type="button" className="btn-ghost flex-1" onClick={() => setStep(2)} disabled={submitting}>Back</button>
              <button type="submit" className="btn-primary flex-1" disabled={submitting || !screenshot}>
                {submitting ? (
                  <>
                    <span className="spinner spinner-btn" aria-hidden="true" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} strokeWidth={1.5} />
                    Submit & verify
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
