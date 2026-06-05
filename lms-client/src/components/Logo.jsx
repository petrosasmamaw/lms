import { Link } from 'react-router-dom'

const themes = {
  student: {
    text: 'from-orange-600 via-orange-500 to-amber-500 group-hover:from-orange-700 group-hover:via-orange-600 group-hover:to-amber-600',
    glow: 'group-hover:drop-shadow-[0_0_12px_rgba(249,115,22,0.35)]',
  },
  admin: {
    text: 'from-indigo-700 via-indigo-600 to-violet-600 group-hover:from-indigo-800 group-hover:via-indigo-700 group-hover:to-violet-700',
    glow: 'group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]',
  },
}

const sizes = {
  sm: 'text-[1.35rem]',
  md: 'text-[1.75rem]',
  lg: 'text-[3rem]',
}

export default function Logo({
  variant = 'student',
  size = 'md',
  centered = false,
  asLink = true,
  className = '',
}) {
  const theme = themes[variant]

  const content = (
    <span
      className={`inline-flex items-center group ${centered ? 'justify-center' : ''} ${className}`}
    >
      <span
        className={`font-logo ${sizes[size]} font-extrabold leading-none tracking-[0.06em] bg-gradient-to-r bg-clip-text text-transparent transition-all duration-200 ${theme.text} ${theme.glow}`}
      >
        LMS
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
