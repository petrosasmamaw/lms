import { db } from '../db/index.js';
import { questions } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all questions
export const getAllQuestions = async () => {
  return await db.query.questions.findMany({
    orderBy: [desc(questions.createdAt)],
  });
};

// Get questions by exam
export const getQuestionsByExam = async (examId) => {
  return await db.query.questions.findMany({
    where: eq(questions.examId, examId),
  });
};

// Get question by ID
export const getQuestionById = async (id) => {
  return await db.query.questions.findFirst({
    where: eq(questions.id, id),
  });
};

// Create question
export const createQuestion = async (data) => {
  const [question] = await db.insert(questions).values(data).returning();
  return question;
};

// Update question
export const updateQuestion = async (id, data) => {
  const [question] = await db
    .update(questions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(questions.id, id))
    .returning();
  return question;
};

// Delete question
export const deleteQuestion = async (id) => {
  const [question] = await db
    .delete(questions)
    .where(eq(questions.id, id))
    .returning();
  return question;
};
