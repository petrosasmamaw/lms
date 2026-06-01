import { getAuth, isEnabled } from '../config/betterAuth.js'

(async function(){
  console.log('isEnabled:', isEnabled())
  const auth = getAuth()
  if(!auth) {
    console.log('auth instance is null')
    process.exit(0)
  }
  console.log('auth keys:', Object.keys(auth))
  try {
    console.log('auth.api keys:', Object.keys(auth.api || {}))
    console.log('auth.api:', JSON.stringify(auth.api || {}, null, 2))
  } catch (e) {
    console.log('Could not stringify auth.api', e)
  }
  try {
    console.log('auth.options:', JSON.stringify(auth.options || {}, null, 2))
  } catch (e) {
    console.log('Could not stringify auth.options', e)
  }
  if (auth.handler) {
    console.log('handler is function:', typeof auth.handler)
    try {
      const req = new Request('http://localhost/api/auth/inspector', { method: 'GET' })
      const res = await auth.handler(req)
      console.log('handler response status:', res.status)
      const text = await res.text()
      console.log('handler response body (first 500 chars):', text.slice(0,500))
    } catch (err) {
      console.error('handler call error:', err)
    }
  }
})()
