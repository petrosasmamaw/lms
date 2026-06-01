import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { testConnection } from './db/index.js';
import { auth } from './config/auth.js';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Better Auth routes
app.all('/api/auth/*', async (req, res) => {
  // Extract the auth route path (e.g., '/get-session' from '/api/auth/get-session')
  const authPath = req.path.substring(9); // Remove '/api/auth' prefix
  const baseAuthURL = process.env.BETTER_AUTH_URL || 'http://localhost:5001/api/auth';
  const fullUrl = `${baseAuthURL}${authPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
  
  const method = req.method;
  const headers = new Headers(req.headers);
  headers.delete('host'); // Remove host header to avoid conflicts
  
  let body = undefined;
  if (method !== 'GET' && method !== 'HEAD' && (req.body || req.rawBody)) {
    body = req.rawBody || (req.body ? JSON.stringify(req.body) : undefined);
  }
  
  const webRequest = new Request(fullUrl, {
    method,
    headers,
    body,
  });
  
  try {
    const webResponse = await auth.handler(webRequest);
    
    // Set response headers from web response
    for (const [key, value] of webResponse.headers.entries()) {
      res.set(key, value);
    }
    
    // Ensure CORS headers are set
    const origin = req.get('origin');
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];
    if (allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Access-Control-Allow-Credentials', 'true');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
    
    // Set status code
    res.status(webResponse.status);
    
    // Send response body
    const responseBody = await webResponse.text();
    res.send(responseBody);
  } catch (error) {
    console.error('Auth handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Import route handlers
import departmentRoutes from './routes/departmentRoutes.js';
import academicYearRoutes from './routes/academicYearRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import examRoutes from './routes/examRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

// Register routes
app.use('/api/departments', departmentRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📚 Better Auth available at http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
