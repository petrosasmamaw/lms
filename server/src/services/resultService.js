import { db } from '../db/index.js';
import { studentExamAttempts } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

// Get all results
export const getAllResults = async () => {
  return await db.query.studentExamAttempts.findMany({ orderBy: [desc(studentExamAttempts.submittedAt)] });
};

// Get results by student
export const getResultsByStudent = async (studentId) => {
  return await db.query.studentExamAttempts.findMany({
    where: eq(studentExamAttempts.studentId, studentId),
    orderBy: [desc(studentExamAttempts.submittedAt)],
  });
};

// Get results by exam
export const getResultsByExam = async (examId) => {
  return await db.query.studentExamAttempts.findMany({
    where: eq(studentExamAttempts.examId, examId),
    orderBy: [desc(studentExamAttempts.submittedAt)],
  });
};

// Get result by ID
export const getResultById = async (id) => {
  return await db.query.studentExamAttempts.findFirst({ where: eq(studentExamAttempts.id, id) });
};

// Create result
export const createResult = async (data) => {
  const [result] = await db.insert(studentExamAttempts).values(data).returning();
  return result;
};

// Update result
export const updateResult = async (id, data) => {
  const [result] = await db.update(studentExamAttempts).set(data).where(eq(studentExamAttempts.id, id)).returning();
  return result;
};

// Get student result for specific exam
export const getStudentExamResult = async (studentId, examId) => {
  return await db.query.studentExamAttempts.findFirst({ where: and(eq(studentExamAttempts.studentId, studentId), eq(studentExamAttempts.examId, examId)) });
};

// Get statistics by department
export const getStatsByDepartment = async (departmentId) => {
  const all = await getAllResults();
  return all.filter((r) => r.departmentId === departmentId);
};
