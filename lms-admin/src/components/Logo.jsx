import { Link } from 'react-router-dom'

const sizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-4xl',
}

export default function Logo({
  variant = 'admin',
  size = 'md',
  centered = false,
  asLink = true,
  className = '',
}) {
  const suffix = variant === 'admin' ? 'Admin' : 'Learn'

  const content = (
    <span className={`inline-flex items-baseline gap-1 group ${centered ? 'justify-center' : ''} ${className}`}>
      <span className={`font-display ${sizes[size]} font-bold tracking-tight text-[var(--color-text-primary)]`}>
        LMS
      </span>
      <span className="font-display text-[0.55em] font-semibold text-[var(--color-accent)] tracking-wide uppercase">
        {suffix}
      </span>
    </span>
  )

  if (!asLink) return content

  return (
    <Link to="/" className={centered ? 'inline-flex justify-center' : 'inline-flex'} aria-label="LMS home">
      {content}
    </Link>
  )
}
