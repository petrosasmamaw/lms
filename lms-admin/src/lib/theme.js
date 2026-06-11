export function initTheme() {
  const stored = localStorage.getItem('lms-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = stored ? stored === 'dark' : true
  document.documentElement.classList.toggle('dark', isDark)
  return isDark
}

export function setTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('lms-theme', dark ? 'dark' : 'light')
}

export function getTheme() {
  return document.documentElement.classList.contains('dark')
}
