import { useEffect, useState } from 'react'
import axios from '../api/axiosInstance'
import { unwrap } from '../api/unwrap'
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Sparkles,
} from 'lucide-react'
import {
  MONTH_NAMES,
  MONTH_SHORT,
  STATUS_LABELS,
  STATUS_BADGE,
  paymentSummary,
} from '../lib/payments'

const STATUS_ICON = {
  complete: CheckCircle2,
  pending: Clock,
  unpaid: CircleDashed,
}

export default function PaymentsPage() {
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get('/payments/me', { params: { year: calendarYear } })
      .then((res) => {
        const data = unwrap(res)
        setPayments(data.payments || [])
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [calendarYear])

  const summary = paymentSummary(payments)

  return (
    <div className="page-shell max-w-5xl mx-auto">
      <header className="payment-hero">
        <div className="payment-hero-text">
          <p className="eyebrow">Tuition & fees</p>
          <h1 className="page-title mt-1">Monthly payments</h1>
          <p className="page-subtitle">
            Track your payment status for each month of the year.
          </p>
        </div>
        <div className="payment-year-nav">
          <button
            type="button"
            className="btn-ghost p-2"
            onClick={() => setCalendarYear((y) => y - 1)}
            aria-label="Previous year"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <span className="payment-year-label font-mono">{calendarYear}</span>
          <button
            type="button"
            className="btn-ghost p-2"
            onClick={() => setCalendarYear((y) => y + 1)}
            aria-label="Next year"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="payment-banner card">
        <div className="payment-banner-icon">
          <Sparkles size={20} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium text-[var(--color-text-primary)]">Phase 1 — Payment overview</p>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">
            Telebirr & CBE Birr payments with screenshot verification are coming in the next phase.
          </p>
        </div>
      </div>

      <div className="payment-stats">
        <div className="payment-stat-card payment-stat-complete">
          <CheckCircle2 size={20} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="payment-stat-value">{summary.complete}</p>
            <p className="payment-stat-label">Paid</p>
          </div>
        </div>
        <div className="payment-stat-card payment-stat-pending">
          <Clock size={20} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="payment-stat-value">{summary.pending}</p>
            <p className="payment-stat-label">Pending</p>
          </div>
        </div>
        <div className="payment-stat-card payment-stat-unpaid">
          <CircleDashed size={20} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="payment-stat-value">{summary.unpaid}</p>
            <p className="payment-stat-label">Unpaid</p>
          </div>
        </div>
        <div className="payment-stat-card payment-stat-progress">
          <div className="payment-progress-ring" style={{ '--progress': summary.progress }}>
            <span className="font-mono text-sm font-semibold">{summary.progress}%</span>
          </div>
          <div>
            <p className="payment-stat-value">{summary.progress}%</p>
            <p className="payment-stat-label">Year complete</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="payment-month-grid">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="skeleton payment-month-card" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="payment-month-grid">
          {payments.map((payment) => {
            const Icon = STATUS_ICON[payment.status] || CircleDashed
            return (
              <article
                key={payment.id}
                className={`payment-month-card payment-month-${payment.status}`}
              >
                <div className="payment-month-header">
                  <span className="payment-month-index font-mono">{MONTH_SHORT[payment.month - 1]}</span>
                  <span className={`badge ${STATUS_BADGE[payment.status]}`}>
                    {STATUS_LABELS[payment.status]}
                  </span>
                </div>
                <div className="payment-month-body">
                  <div className={`payment-month-icon payment-month-icon-${payment.status}`}>
                    <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="payment-month-name">{MONTH_NAMES[payment.month - 1]}</h3>
                  <p className="payment-month-year font-mono">{calendarYear}</p>
                </div>
                {payment.status === 'unpaid' && (
                  <p className="payment-month-hint">Payment options coming soon</p>
                )}
                {payment.status === 'pending' && (
                  <p className="payment-month-hint payment-month-hint-pending">
                    Awaiting admin verification
                  </p>
                )}
                {payment.status === 'complete' && (
                  <p className="payment-month-hint payment-month-hint-complete">
                    Payment confirmed
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}

      {!loading && !payments.length && (
        <div className="card mt-8">
          <div className="empty-state py-10">
            <div className="empty-state-icon">
              <Wallet size={24} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h2 className="empty-state-title">No payments yet</h2>
            <p className="empty-state-desc">Your monthly payment schedule will appear here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
