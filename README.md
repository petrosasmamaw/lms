# LMS — Learning Management System

A full-stack Learning Management System with separate **student** and **admin** web apps, a shared Express API, and PostgreSQL storage. Students browse courses, access resources, and take exams. Admins manage departments, courses, resources, and exams.

## Architecture

```
LMS/
├── server/       # Express API, auth, database (Drizzle ORM)
├── lms-client/   # Student portal (React + Vite)
└── lms-admin/    # Admin dashboard (React + Vite)
```

| App          | Default URL              | Purpose                          |
| ------------ | ------------------------ | -------------------------------- |
| Server       | `http://localhost:5001`  | REST API + Better Auth           |
| lms-client   | `http://localhost:5175`  | Student login, courses, exams    |
| lms-admin    | `http://localhost:5173`  | Admin dashboard and content mgmt |

## Features

### Student portal (`lms-client`)
- Sign up / log in (Better Auth)
- View enrolled courses by department and year
- Browse course resources (PDFs, videos via Cloudinary)
- Take multiple-choice exams and view results

### Admin dashboard (`lms-admin`)
- Admin sign up / log in
- Manage departments and academic years
- Create and organize courses
- Upload and manage course resources
- Build exams with questions and answer choices

### Backend (`server`)
- REST API for departments, courses, resources, exams, and users
- Session-based auth with [Better Auth](https://www.better-auth.com/)
- File uploads to Cloudinary
- PostgreSQL with Drizzle ORM (Neon-compatible)

## Tech stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Frontend | React 19, Vite, Redux Toolkit, Tailwind CSS 4     |
| Backend  | Node.js, Express, Zod validation                  |
| Database | PostgreSQL, Drizzle ORM                           |
| Auth     | Better Auth                                       |
| Storage  | Cloudinary (resources)                            |

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))
- Cloudinary account (for resource uploads)
- npm

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd LMS

npm install --prefix server
npm install --prefix lms-client
npm install --prefix lms-admin
```

### 2. Environment variables

Create `server/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lms

# Auth
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:5001

# Server
PORT=5001
NODE_ENV=development

# CORS (optional in dev — defaults include localhost ports)
STUDENT_CLIENT_URL=http://localhost:5175
ADMIN_CLIENT_URL=http://localhost:5173

# Cloudinary (required for resource uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Optional client env (defaults work for local dev):

**lms-client/.env**
```env
VITE_API_URL=http://localhost:5001/api
```

**lms-admin/.env**
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Database setup

```bash
cd server
npm run db:migrate
npm run seed          # optional demo data
```

### 4. Run all services

Open three terminals:

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — Student app
cd lms-client && npm run dev

# Terminal 3 — Admin app
cd lms-admin && npm run dev
```

Verify the API: `GET http://localhost:5001/api/health`

## Project structure

```
server/
├── src/
│   ├── controllers/   # Route handlers
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic
│   ├── db/            # Drizzle schema and connection
│   ├── config/        # Auth, Cloudinary, CORS
│   └── middleware/    # Auth and error handling
└── drizzle.config.js

lms-client/ & lms-admin/
├── src/
│   ├── pages/         # Route pages
│   ├── components/    # Shared UI
│   ├── features/      # Redux slices (auth, courses, etc.)
│   └── api/           # Axios instance
```

## API overview

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/health`         | Health check             |
| *      | `/api/auth/*`         | Better Auth routes       |
| GET    | `/api/users/me`       | Current session user     |
| *      | `/api/departments`    | Department CRUD          |
| *      | `/api/courses`        | Course CRUD              |
| *      | `/api/resources`      | Resource upload & list   |
| *      | `/api/exams`          | Exams, questions, submit |

## Scripts

### Server
| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start with nodemon         |
| `npm run start`   | Production start           |
| `npm run db:migrate` | Run Drizzle migrations  |
| `npm run db:studio`  | Open Drizzle Studio     |
| `npm run seed`    | Seed demo data             |

### Client & Admin
| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Dev server with HMR        |
| `npm run build`   | Production build           |
| `npm run preview` | Preview production build   |
| `npm run lint`    | Run ESLint                 |

## License

ISC
