export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state card">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
