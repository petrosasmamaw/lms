import { db } from '../db/index.js';
import { student_exam_attempts, exams, courses } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

// Get all results
export const getAllResults = async () => {
  return await db.query.student_exam_attempts.findMany({ orderBy: [desc(student_exam_attempts.submittedAt)] });
};

// Get results by student
export const getResultsByStudent = async (studentId) => {
  return await db.query.student_exam_attempts.findMany({
    where: eq(student_exam_attempts.studentId, studentId),
    orderBy: [desc(student_exam_attempts.submittedAt)],
  });
};

// Get results by exam
export const getResultsByExam = async (examId) => {
  return await db.query.student_exam_attempts.findMany({
    where: eq(student_exam_attempts.examId, examId),
    orderBy: [desc(student_exam_attempts.submittedAt)],
  });
};

// Get result by ID
export const getResultById = async (id) => {
  return await db.query.student_exam_attempts.findFirst({ where: eq(student_exam_attempts.id, id) });
};

// Create result
export const createResult = async (data) => {
  const [result] = await db.insert(student_exam_attempts).values(data).returning();
  return result;
};

// Update result
export const updateResult = async (id, data) => {
  const [result] = await db.update(student_exam_attempts).set(data).where(eq(student_exam_attempts.id, id)).returning();
  return result;
};

// Get student result for specific exam
export const getStudentExamResult = async (studentId, examId) => {
  return await db.query.student_exam_attempts.findFirst({ where: and(eq(student_exam_attempts.studentId, studentId), eq(student_exam_attempts.examId, examId)) });
};

// Get statistics by department
export const getStatsByDepartment = async (departmentId) => {
  const all = await getAllResults();
  return all.filter((r) => r.departmentId === departmentId);
};
