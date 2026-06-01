import { db } from '../db/index.js';
import { exams, questions } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all exams
export const getAllExams = async () => {
  return await db.query.exams.findMany({
    orderBy: [desc(exams.createdAt)],
  });
};

// Get exams by course
export const getExamsByCourse = async (courseId) => {
  return await db.query.exams.findMany({
    where: eq(exams.courseId, courseId),
    orderBy: [exams.title],
  });
};

// Get exam by ID
export const getExamById = async (id) => {
  return await db.query.exams.findFirst({
    where: eq(exams.id, id),
  });
};

// Create exam
export const createExam = async (data) => {
  const [exam] = await db.insert(exams).values(data).returning();
  return exam;
};

// Update exam
export const updateExam = async (id, data) => {
  const [exam] = await db
    .update(exams)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(exams.id, id))
    .returning();
  return exam;
};

// Delete exam
export const deleteExam = async (id) => {
  const [exam] = await db
    .delete(exams)
    .where(eq(exams.id, id))
    .returning();
  return exam;
};

// Get exam with questions
export const getExamWithQuestions = async (id) => {
  const exam = await getExamById(id);
  if (!exam) return null;

  const examQuestions = await db.query.questions.findMany({
    where: eq(questions.examId, id),
  });

  return {
    ...exam,
    questions: examQuestions,
  };
};
