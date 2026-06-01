import { pgTable, text, serial, timestamp, integer, boolean, varchar, decimal, foreignKey, unique } from 'drizzle-orm/pg-core';

// Users table (Better Auth will manage auth, we extend it)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // From Better Auth
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('student'), // 'admin' or 'student'
  departmentId: integer('department_id'),
  academicYearId: integer('academic_year_id'),
  studentId: varchar('student_id', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Departments table
export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Academic Years table (Year 1, 2, 3, 4)
export const academicYears = pgTable('academic_years', {
  id: serial('id').primaryKey(),
  departmentId: integer('department_id').notNull(),
  yearName: varchar('year_name', { length: 50 }).notNull(), // 'Year 1', 'Year 2', etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  departmentFk: foreignKey({
    columns: [table.departmentId],
    foreignColumns: [departments.id],
  }),
  uniqueDeptYear: unique().on(table.departmentId, table.yearName),
}));

// Courses table
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  departmentId: integer('department_id').notNull(),
  academicYearId: integer('academic_year_id').notNull(),
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
  yearFk: foreignKey({
    columns: [table.academicYearId],
    foreignColumns: [academicYears.id],
  }),
}));

// Resources table (PDFs, Videos, etc.)
export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // 'pdf', 'video', 'doc', etc.
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
  totalQuestions: integer('total_questions').default(0),
  passingPercentage: decimal('passing_percentage', { precision: 5, scale: 2 }).default('40.00'),
  duration: integer('duration').default(60), // in minutes
  isActive: boolean('is_active').default(true),
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
  optionA: text('option_a').notNull(),
  optionB: text('option_b').notNull(),
  optionC: text('option_c').notNull(),
  optionD: text('option_d').notNull(),
  correctAnswer: varchar('correct_answer', { length: 1 }).notNull(), // A, B, C, D
  explanation: text('explanation'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  examFk: foreignKey({
    columns: [table.examId],
    foreignColumns: [exams.id],
  }),
}));

// Results table
export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  examId: integer('exam_id').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(),
  percentage: decimal('percentage', { precision: 5, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('completed'), // 'completed', 'pending'
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  studentFk: foreignKey({
    columns: [table.studentId],
    foreignColumns: [users.id],
  }),
  examFk: foreignKey({
    columns: [table.examId],
    foreignColumns: [exams.id],
  }),
}));

// Student Answers table
export const studentAnswers = pgTable('student_answers', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  questionId: integer('question_id').notNull(),
  selectedAnswer: varchar('selected_answer', { length: 1 }),
  isCorrect: boolean('is_correct').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  studentFk: foreignKey({
    columns: [table.studentId],
    foreignColumns: [users.id],
  }),
  questionFk: foreignKey({
    columns: [table.questionId],
    foreignColumns: [questions.id],
  }),
}));

// Enrollments table (Track which students are enrolled in which courses)
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  courseId: integer('course_id').notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  studentFk: foreignKey({
    columns: [table.studentId],
    foreignColumns: [users.id],
  }),
  courseFk: foreignKey({
    columns: [table.courseId],
    foreignColumns: [courses.id],
  }),
}));
