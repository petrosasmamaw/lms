import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from '../api/axiosInstance'
import { unwrap } from '../api/unwrap'
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  ChevronLeft,
  ChevronRight,
  Wallet,
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

export default function StudentPaymentPage() {
  const { departmentId, year, studentId } = useParams()
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [student, setStudent] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const loadPayments = () => {
    setLoading(true)
    axios
      .get(`/payments/student/${studentId}`, { params: { year: calendarYear } })
      .then((res) => {
        const data = unwrap(res)
        setStudent(data.student)
        setPayments(data.payments || [])
      })
      .catch(() => {
        setStudent(null)
        setPayments([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPayments()
  }, [studentId, calendarYear])

  const handleStatusChange = async (payment, status) => {
    if (payment.status === status) return
    setUpdatingId(payment.id)
    try {
      const res = await axios.patch(`/payments/${payment.id}`, { status })
      const updated = unwrap(res).payment
      setPayments((prev) => prev.map((p) => (p.id === payment.id ? updated : p)))
    } catch {
      alert('Failed to update payment status')
    } finally {
      setUpdatingId(null)
    }
  }

  const summary = paymentSummary(payments)
  const backUrl = `/departments/${departmentId}/year/${year}`

  return (
    <div className="page-shell">
      <Link to={backUrl} className="link-back">← Back to department</Link>

      <header className="payment-hero mt-4">
        <div className="payment-hero-text">
          <p className="eyebrow">Monthly payments</p>
          <h1 className="page-title mt-1">{student?.name || 'Student'}</h1>
          <p className="page-subtitle font-mono">{student?.email}</p>
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

      <div className="payment-stats">
        <div className="payment-stat-card payment-stat-complete">
          <CheckCircle2 size={20} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="payment-stat-value">{summary.complete}</p>
            <p className="payment-stat-label">Complete</p>
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
            <p className="payment-stat-label">Year progress</p>
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
            const isUpdating = updatingId === payment.id
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
                <div className="payment-month-actions">
                  {(['unpaid', 'pending', 'complete']).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(payment, status)}
                      className={`payment-status-btn ${payment.status === status ? 'payment-status-btn-active' : ''}`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
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
            <h2 className="empty-state-title">No payment records</h2>
            <p className="empty-state-desc">Payment months will appear here once initialized.</p>
          </div>
        </div>
      )}
    </div>
  )
}
