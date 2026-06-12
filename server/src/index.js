import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import { testConnection } from './db/index.js';
import { auth } from './config/auth.js';
import { getAllowedOrigins } from './config/allowedOrigins.js';
import { signupAdmin, signupStudent } from './controllers/authSignupController.js';

config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
}));

app.post('/api/auth/signup-admin', express.json(), signupAdmin);
app.post('/api/auth/signup-student', express.json(), signupStudent);

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/users/me', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { getUserById } = await import('./services/userService.js');
    const profile = await getUserById(session.user.id);

    return res.json({ success: true, user: profile || session.user });
  } catch (err) {
    console.error('GET /api/users/me', err);
    return res.status(500).json({ success: false, message: 'Failed to load user' });
  }
});

import departmentRoutes from './routes/departmentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import examRoutes from './routes/examRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

async function startServer() {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.warn('Warning: database connection failed.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Better Auth at http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
