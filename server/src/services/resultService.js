import { db } from '../db/index.js';
import { results, exams, courses, academicYears } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

// Get all results
export const getAllResults = async () => {
  return await db.query.results.findMany({
    orderBy: [desc(results.submittedAt)],
  });
};

// Get results by student
export const getResultsByStudent = async (studentId) => {
  return await db.query.results.findMany({
    where: eq(results.studentId, studentId),
    orderBy: [desc(results.submittedAt)],
  });
};

// Get results by exam
export const getResultsByExam = async (examId) => {
  return await db.query.results.findMany({
    where: eq(results.examId, examId),
    orderBy: [desc(results.submittedAt)],
  });
};

// Get result by ID
export const getResultById = async (id) => {
  return await db.query.results.findFirst({
    where: eq(results.id, id),
  });
};

// Create result
export const createResult = async (data) => {
  const [result] = await db.insert(results).values(data).returning();
  return result;
};

// Update result
export const updateResult = async (id, data) => {
  const [result] = await db
    .update(results)
    .set(data)
    .where(eq(results.id, id))
    .returning();
  return result;
};

// Get student result for specific exam
export const getStudentExamResult = async (studentId, examId) => {
  return await db.query.results.findFirst({
    where: and(
      eq(results.studentId, studentId),
      eq(results.examId, examId)
    ),
  });
};

// Get statistics by department
export const getStatsByDepartment = async (departmentId) => {
  // Get all results for students in this department
  // This would need a more complex query with joins
  const allResults = await getAllResults();
  return allResults.filter(r => r.departmentId === departmentId);
};
