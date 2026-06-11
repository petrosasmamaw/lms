import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, setTheme } from '../lib/theme'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    setDark(getTheme())
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-icon"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={16} strokeWidth={1.5} aria-hidden="true" /> : <Moon size={16} strokeWidth={1.5} aria-hidden="true" />}
    </button>
  )
}
