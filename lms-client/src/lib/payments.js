export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const STATUS_LABELS = {
  unpaid: 'Unpaid',
  pending: 'Pending review',
  complete: 'Paid',
}

export const STATUS_BADGE = {
  unpaid: 'badge-neutral',
  pending: 'badge-warning',
  complete: 'badge-success',
}

export function paymentSummary(payments = []) {
  const complete = payments.filter((p) => p.status === 'complete').length
  const pending = payments.filter((p) => p.status === 'pending').length
  const unpaid = payments.filter((p) => p.status === 'unpaid').length
  const total = payments.length || 12
  const progress = total ? Math.round((complete / total) * 100) : 0
  return { complete, pending, unpaid, total, progress }
}
