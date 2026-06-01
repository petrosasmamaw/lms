export default function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err)
  if (res.headersSent) {
    // headers already sent, cannot send another response
    return
  }
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ success: false, message })
}
