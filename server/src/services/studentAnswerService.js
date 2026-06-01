import { db } from '../db/index.js';
import { student_answers } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

// Get all student answers
export const getAllStudentAnswers = async () => {
  return await db.query.student_answers.findMany();
};

// Get student answers for exam
export const getStudentExamAnswers = async (studentId, examId) => {
  // This needs a join with questions to get exam_id
  return await db.query.student_answers.findMany({ where: eq(student_answers.studentId, studentId) });
};

// Get student answer for specific question
export const getStudentQuestionAnswer = async (studentId, questionId) => {
  return await db.query.student_answers.findFirst({ where: and(eq(student_answers.studentId, studentId), eq(student_answers.questionId, questionId)) });
};

// Create student answer
export const createStudentAnswer = async (data) => {
  const [answer] = await db.insert(student_answers).values(data).returning();
  return answer;
};

// Update student answer
export const updateStudentAnswer = async (id, data) => {
  const [answer] = await db.update(student_answers).set(data).where(eq(student_answers.id, id)).returning();
  return answer;
};

// Get or create student answer
export const upsertStudentAnswer = async (studentId, questionId, data) => {
  const existing = await getStudentQuestionAnswer(studentId, questionId);
  if (existing) {
    return updateStudentAnswer(existing.id, data);
  }
  return createStudentAnswer({
    studentId,
    questionId,
    ...data,
  });
};
