import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { testConnection } from './src/db/index.js';
import { auth } from './src/config/auth.js';

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
app.all('/api/auth/*', (req, res) => {
  return auth.handler(req, res);
});

// Import route handlers
import departmentRoutes from './src/routes/departmentRoutes.js';
import academicYearRoutes from './src/routes/academicYearRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import resourceRoutes from './src/routes/resourceRoutes.js';
import examRoutes from './src/routes/examRoutes.js';
import questionRoutes from './src/routes/questionRoutes.js';
import resultRoutes from './src/routes/resultRoutes.js';

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
