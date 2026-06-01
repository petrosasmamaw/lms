export default function Button({ children, onClick, type = 'button', className = '', disabled }) {
  const classes = `btn ${className}`.trim()
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}
