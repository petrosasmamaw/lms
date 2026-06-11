import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
  varchar,
  decimal,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Better Auth user table (extended with LMS role / department / year)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: varchar('role', { length: 20 }).notNull().default('student'),
  verified: boolean('verified').default(false).notNull(),
  departmentId: integer('department_id'),
  year: integer('year'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
}, (table) => ({
  sessionUserIdIdx: index('session_userId_idx').on(table.userId),
}));

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  accountUserIdIdx: index('account_userId_idx').on(table.userId),
}));

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  verificationIdentifierIdx: index('verification_identifier_idx').on(table.identifier),
}));

export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  departmentId: integer('department_id').notNull().references(() => departments.id),
  year: integer('year').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  url: text('url').notNull(),
  publicId: text('public_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').notNull().references(() => exams.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const choices = pgTable('choices', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  choiceText: text('choice_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const studentExamAttempts = pgTable('student_exam_attempts', {
  id: serial('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  examId: integer('exam_id').notNull().references(() => exams.id, { onDelete: 'cascade' }),
  score: decimal('score', { precision: 5, scale: 2 }),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const questionsRelations = relations(questions, ({ many }) => ({
  choices: many(choices),
}));

export const choicesRelations = relations(choices, ({ one }) => ({
  question: one(questions, { fields: [choices.questionId], references: [questions.id] }),
}));
