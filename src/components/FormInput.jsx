export default function FormInput({ label, type = 'text', value, onChange, placeholder, required, name, autoComplete, ...rest }) {
  return (
    <div style={{ textAlign: 'left', marginBottom: '12px' }}>
      {label && <label className="form-label" htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="form-input"
        {...rest}
      />
    </div>
  )
}
