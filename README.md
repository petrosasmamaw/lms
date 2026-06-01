# 📚 Learning Management System (LMS)

A complete, production-ready Learning Management System built with React, Vite, Express, PostgreSQL (Neon), Drizzle ORM, and Better Auth.

![LMS Architecture](https://img.shields.io/badge/React-19.2.6-blue) ![Backend](https://img.shields.io/badge/Express-4.18.2-green) ![Database](https://img.shields.io/badge/PostgreSQL-Drizzle-orange) ![Auth](https://img.shields.io/badge/BetterAuth-1.5.6-purple)

## 🎯 Features

### Core Features
- ✅ **User Authentication** - Register, Login, Logout with Better Auth
- ✅ **Role-Based Access** - Admin and Student roles with different permissions  
- ✅ **Department Management** - Organize by departments
- ✅ **Academic Structure** - Years, Courses, Resources, Exams, Questions
- ✅ **Exam System** - Create exams, manage questions, track results
- ✅ **Student Results** - Automatic scoring and progress tracking
- ✅ **Resource Management** - Upload and organize learning materials

### Technical Features
- ✅ **Responsive Design** - Tailwind CSS with mobile-first approach
- ✅ **State Management** - Redux Toolkit for predictable state
- ✅ **Type-Safe** - Zod validation for all inputs
- ✅ **API-First** - RESTful API with proper error handling
- ✅ **Database Migrations** - Drizzle ORM with migrations
- ✅ **Session Management** - Secure httpOnly cookie-based sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

**1. Backend Setup**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL
npm run db:migrate
npm run dev
```

**2. Frontend Setup**
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

## 📖 API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - Register user
- `POST /api/auth/sign-in/email` - Login user
- `GET /api/auth/get-session` - Get current session

### Departments
- `GET /api/departments` - List all
- `POST /api/departments` - Create (admin only)
- `PUT /api/departments/:id` - Update (admin only)
- `DELETE /api/departments/:id` - Delete (admin only)

### Academic Years
- `GET /api/academic-years?departmentId=1` - List by department
- `POST /api/academic-years` - Create (admin only)
- `PUT /api/academic-years/:id` - Update (admin only)
- `DELETE /api/academic-years/:id` - Delete (admin only)

### Courses
- `GET /api/courses?academicYearId=1` - List by year
- `GET /api/courses/:id` - Get with content
- `POST /api/courses` - Create (admin only)
- `PUT /api/courses/:id` - Update (admin only)
- `DELETE /api/courses/:id` - Delete (admin only)

### Resources
- `GET /api/resources?courseId=1` - List by course
- `POST /api/resources` - Create (admin only)
- `DELETE /api/resources/:id` - Delete (admin only)

### Exams
- `GET /api/exams?courseId=1` - List by course
- `GET /api/exams/:id` - Get with questions
- `POST /api/exams` - Create (admin only)
- `DELETE /api/exams/:id` - Delete (admin only)

### Results
- `GET /api/results` - List results
- `POST /api/results/submit` - Submit exam (student)
- `GET /api/results/exam/:examId` - Get exam result (student)

## 🏗️ Architecture

```
Department
  └─ Academic Year (Year 1-4)
      └─ Courses
          ├─ Resources
          ├─ Exams
          │  └─ Questions
          └─ Results
```

## 🗂️ Project Structure

```
lms/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                  # Express Backend
│   ├── src/
│   │   ├── config/
│   │   ├── db/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   └── package.json
└── SETUP.md                 # Detailed documentation
```

## 🔐 User Roles

### Admin
- Full system access
- Manage departments, courses, exams
- View all student results

### Student
- Access assigned department/year
- View courses and resources
- Take exams and view results

## 🛠️ Tech Stack

### Frontend
- React 19.2.6 + Vite 8.0
- Redux Toolkit
- Axios
- Tailwind CSS
- React Router DOM

### Backend
- Express 4.18
- PostgreSQL + Drizzle ORM
- Better Auth
- Zod validation

## 📚 Documentation

- **SETUP.md** - Detailed setup and configuration guide
- **API Documentation** - See SETUP.md for complete API reference

## ✨ Key Highlights

- **Academic Structure**: Hierarchical organization from Department → Year → Course → Resources/Exams
- **Student Data Isolation**: Students only see their department and academic year
- **Automatic Grading**: System calculates scores and percentages automatically
- **Session Management**: Secure httpOnly cookies with Better Auth
- **Type Safety**: Input validation with Zod
- **Modern UI**: Responsive design with Tailwind CSS

## 🚨 Important Notes

1. **Environment Variables**: Copy `.env.example` to `.env` in both client and server
2. **Database**: Run migrations with `npm run db:migrate` in server folder
3. **CORS**: Configured for localhost development, update for production
4. **Session**: Ensure cookies are enabled in browser

## 📝 Example: Create Test Data

```bash
# Login as admin first, then:

# Create Department
POST /api/departments
{ "name": "Software Engineering", "description": "SE Dept" }

# Create Academic Year
POST /api/academic-years
{ "departmentId": 1, "yearName": "Year 1" }

# Create Course
POST /api/courses
{ 
  "departmentId": 1, 
  "academicYearId": 1,
  "name": "Programming 101",
  "code": "CS101"
}

# Create Exam
POST /api/exams
{ "courseId": 1, "title": "Quiz 1", "duration": 60 }

# Create Questions
POST /api/questions
{
  "examId": 1,
  "questionText": "What is 2+2?",
  "optionA": "4",
  "optionB": "5", 
  "optionC": "3",
  "optionD": "6",
  "correctAnswer": "A"
}
```

## 🐛 Troubleshooting

**CORS Error**: Check CLIENT_URL in server .env matches frontend URL
**Session Failed**: Verify BETTER_AUTH_URL points to correct backend endpoint
**Database Error**: Confirm DATABASE_URL is valid and accessible
**Page Blank**: Check Redux state in dev tools and API calls in network tab

## 📞 Support

For detailed troubleshooting and advanced configuration, see SETUP.md

---

Built with ❤️ for modern education technology
