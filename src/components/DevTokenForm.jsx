import { useState } from 'react'

export default function DevTokenForm() {
  const [token, setToken] = useState(() => (typeof localStorage !== 'undefined' ? localStorage.getItem('dev_token') || '' : ''))

  function save() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dev_token', token)
      window.dispatchEvent(new Event('dev-token-changed'))
      alert('Dev token saved — auth refreshed')
    }
  }

  function clear() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('dev_token')
      window.dispatchEvent(new Event('dev-token-changed'))
      setToken('')
    }
  }

  return (
    <div style={{ marginTop: 12, padding: 8, border: '1px dashed #ccc' }}>
      <div>Dev: paste seeded session token to simulate login</div>
      <input value={token} onChange={(e) => setToken(e.target.value)} style={{ width: '100%' }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={save}>Save token</button>
        <button onClick={clear} style={{ marginLeft: 8 }}>Clear</button>
      </div>
    </div>
  )
}
