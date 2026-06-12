export default function LoadingButton({
  loading = false,
  loadingText = 'Loading…',
  children,
  className = 'btn-primary',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={className} disabled={disabled || loading} {...props}>
      {loading && <span className="spinner spinner-btn" aria-hidden="true" />}
      {loading ? loadingText : children}
    </button>
  )
}
