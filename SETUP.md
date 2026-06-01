# LMS Project Setup

This is a complete Learning Management System built with React, Express, PostgreSQL, and Better Auth.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon PostgreSQL URL)
- Cloudinary account (optional, for file uploads)

## Environment Setup

### 1. Backend Environment (.env)

Create a `.env` file in the `server/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/lms_db
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:5000/api/auth
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Frontend Environment (.env)

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_BETTER_AUTH_URL=http://localhost:5000/api/auth
```

## Installation

### Backend Setup

```bash
cd server
npm install
npm run db:migrate
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Schema

The LMS uses the following structure:

- **Departments** (top level)
  - **Academic Years** (Year 1, Year 2, etc.)
    - **Courses**
      - **Resources** (PDFs, videos, etc.)
      - **Exams**
        - **Questions**
    - **Results** (student exam results)
    - **Student Answers**

## API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - Register new user
- `POST /api/auth/sign-in/email` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/get-session` - Get current session

### Departments
- `GET /api/departments` - List all departments
- `GET /api/departments/:id` - Get department details
- `POST /api/departments` - Create department (admin only)
- `PUT /api/departments/:id` - Update department (admin only)
- `DELETE /api/departments/:id` - Delete department (admin only)

### Academic Years
- `GET /api/academic-years` - List academic years
- `GET /api/academic-years/:id` - Get academic year details
- `POST /api/academic-years` - Create academic year (admin only)
- `PUT /api/academic-years/:id` - Update academic year (admin only)
- `DELETE /api/academic-years/:id` - Delete academic year (admin only)

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course with resources and exams
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Resources
- `GET /api/resources` - List resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources` - Create resource (admin only)
- `PUT /api/resources/:id` - Update resource (admin only)
- `DELETE /api/resources/:id` - Delete resource (admin only)

### Exams
- `GET /api/exams` - List exams
- `GET /api/exams/:id` - Get exam with questions
- `POST /api/exams` - Create exam (admin only)
- `PUT /api/exams/:id` - Update exam (admin only)
- `DELETE /api/exams/:id` - Delete exam (admin only)

### Questions
- `GET /api/questions` - List questions
- `GET /api/questions/:id` - Get question details
- `POST /api/questions` - Create question (admin only)
- `PUT /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)

### Results
- `GET /api/results` - List results (admin sees all, student sees own)
- `GET /api/results/:id` - Get result details
- `POST /api/results/submit` - Submit exam (student)
- `GET /api/results/exam/:examId` - Get result for specific exam (student)

## User Roles

### Admin
- Full control over departments, academic years, courses
- Can create and manage exams and questions
- Can view all student results and statistics
- Can upload learning resources

### Student
- Can only access their assigned department and academic year
- Can view courses relevant to their year
- Can access learning resources
- Can take exams and view results
- Can see only their own progress

## Project Structure

```
lms/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux slices and store
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── db/            # Database setup
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── validators/    # Input validation
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Server entry point
│   ├── package.json
│   ├── drizzle.config.js
│   └── migrations/        # Database migrations
└── README.md

```

## Testing the Application

### 1. Create Admin Account
```bash
POST /api/auth/sign-up/email
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "Admin@123",
  "role": "admin"
}
```

### 2. Create Student Account
```bash
POST /api/auth/sign-up/email
{
  "name": "Student User",
  "email": "student@test.com",
  "password": "Student@123",
  "role": "student",
  "departmentId": 1,
  "academicYearId": 1,
  "studentId": "STU001"
}
```

### 3. Login
```bash
POST /api/auth/sign-in/email
{
  "email": "admin@test.com",
  "password": "Admin@123"
}
```

## Features

✅ User Authentication (Register, Login, Logout, Session Management)
✅ Role-Based Access Control (Admin, Student)
✅ Department Management
✅ Academic Year Organization
✅ Course Management
✅ Learning Resources Upload
✅ Exam Creation and Management
✅ Question Management
✅ Student Results Tracking
✅ Responsive UI with Tailwind CSS
✅ Redux State Management
✅ Complete API with proper error handling

## Troubleshooting

### Database Connection Error
- Ensure DATABASE_URL is correct
- Check PostgreSQL is running
- Verify network connectivity

### CORS Issues
- Ensure CLIENT_URL matches your frontend URL
- Check BETTER_AUTH_URL is correctly configured

### Session Not Persisting
- Verify cookies are enabled in browser
- Check withCredentials is set to true in Axios calls
- Ensure same-site cookie settings are appropriate

## Performance Notes

- Implement pagination for large datasets
- Add caching for frequently accessed data
- Use indexes on commonly queried fields
- Consider implementing lazy loading for resources

## Security Notes

- Always use HTTPS in production
- Set secure cookie flags in production
- Implement rate limiting on authentication endpoints
- Validate all inputs on both frontend and backend
- Use environment variables for sensitive data
- Implement CSRF protection for state-changing operations

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
