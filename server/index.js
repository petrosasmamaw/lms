import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { nodeHandler } from './auth.mjs'
import departmentRoutes from './src/routes/departmentRoutes.js'
import courseRoutes from './src/routes/courseRoutes.js'
import resourceRoutes from './src/routes/resourceRoutes.js'
import appAuthRoutes from './src/routes/appAuthRoutes.js'
import errorHandler from './src/middleware/errorHandler.js'

dotenv.config()

const app = express()

// CORS configuration for better-auth
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.BETTER_AUTH_URL],
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

// Mount Better Auth handler
app.use('/api/auth', nodeHandler)

app.use('/api/departments', departmentRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/users', appAuthRoutes)

// debug: list registered routes
app.get('/api/routes', (req, res) => {
  const routes = []
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      routes.push(middleware.route.path)
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route
        route && routes.push(route.path)
      })
    }
  })
  res.json({ routes })
})

// Print registered routes on startup for debugging (safe)
const registered = []
if (app._router && Array.isArray(app._router.stack)) {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) registered.push(middleware.route.path)
    else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((h) => {
        if (h.route) registered.push(h.route.path)
      })
    }
  })
}
// eslint-disable-next-line no-console
console.log('Registered routes:', registered)

const PORT = process.env.PORT || 5000

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use(errorHandler)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`)
})

export default app
