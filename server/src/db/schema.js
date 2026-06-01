import { pgTable, text, serial, timestamp, integer, boolean, varchar, decimal, foreignKey, unique } from 'drizzle-orm/pg-core';

// Users table (linked to Better Auth via `auth_user_id`)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  authUserId: text('auth_user_id').notNull().unique(), // Better Auth user id
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'), // optional hashed password (kept in sync for legacy flows)
  role: varchar('role', { length: 20 }).notNull().default('student'), // 'admin' or 'student'
  departmentId: integer('department_id'), // NULL for admins
  year: integer('year'), // academic year (1..4) - NULL for admins
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  departmentFk: foreignKey({ columns: [table.departmentId], foreignColumns: [] }),
}));

// Departments table
export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Academic Years table (Year 1, 2, 3, 4)
// NOTE: academic years are modelled as integer `year` on users and courses per spec

// Courses table
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  departmentId: integer('department_id').notNull(),
  year: integer('year').notNull(), // numeric year (1..4)
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  description: text('description'),
  credits: integer('credits').default(3),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  departmentFk: foreignKey({
    columns: [table.departmentId],
    foreignColumns: [departments.id],
  }),
}));

// Resources table (PDFs, Videos, etc.)
export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'pdf','doc','video'
  url: text('url').notNull(), // Cloudinary URL
  publicId: text('public_id'), // Cloudinary public_id
  uploadedBy: integer('uploaded_by'), // User ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  courseFk: foreignKey({
    columns: [table.courseId],
    foreignColumns: [courses.id],
  }),
}));

// Exams table
export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  courseFk: foreignKey({
    columns: [table.courseId],
    foreignColumns: [courses.id],
  }),
}));

// Questions table
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').notNull(),
  questionText: text('question_text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  examFk: foreignKey({
    columns: [table.examId],
    foreignColumns: [exams.id],
  }),
}));

// Choices for each question
export const choices = pgTable('choices', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').notNull(),
  choiceText: text('choice_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  questionFk: foreignKey({ columns: [table.questionId], foreignColumns: [questions.id] }),
}));

// Results table
// Student exam attempts / results
export const student_exam_attempts = pgTable('student_exam_attempts', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  examId: integer('exam_id').notNull(),
  score: decimal('score', { precision: 5, scale: 2 }),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  studentFk: foreignKey({ columns: [table.studentId], foreignColumns: [users.id] }),
  examFk: foreignKey({ columns: [table.examId], foreignColumns: [exams.id] }),
}));

// Student Answers table
// Student answers (linked to choices)
export const student_answers = pgTable('student_answers', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  questionId: integer('question_id').notNull(),
  choiceId: integer('choice_id'),
  isCorrect: boolean('is_correct').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  studentFk: foreignKey({ columns: [table.studentId], foreignColumns: [users.id] }),
  questionFk: foreignKey({ columns: [table.questionId], foreignColumns: [questions.id] }),
  choiceFk: foreignKey({ columns: [table.choiceId], foreignColumns: [choices.id] }),
}));

// Enrollments table (Track which students are enrolled in which courses)
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  courseId: integer('course_id').notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  studentFk: foreignKey({ columns: [table.studentId], foreignColumns: [users.id] }),
  courseFk: foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }),
}));

// Better Auth Tables
// Session table for Better Auth
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull(),
});

// Account table for Better Auth (for OAuth/external auth)
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Verification table for Better Auth (for email verification, password reset, etc.)
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});
