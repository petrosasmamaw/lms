import { db } from '../db/index.js';
import { exams } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const getAllExams = async () => {
  return db.query.exams.findMany({ orderBy: [desc(exams.createdAt)] });
};

export const getExamsByCourse = async (courseId) => {
  return db.query.exams.findMany({
    where: eq(exams.courseId, Number(courseId)),
    orderBy: [exams.title],
  });
};

export const getExamById = async (id) => {
  return db.query.exams.findFirst({ where: eq(exams.id, Number(id)) });
};

export const createExam = async (data) => {
  const [exam] = await db.insert(exams).values({
    courseId: Number(data.courseId),
    title: data.title,
  }).returning();
  return exam;
};

export const updateExam = async (id, data) => {
  const [exam] = await db
    .update(exams)
    .set({ title: data.title })
    .where(eq(exams.id, Number(id)))
    .returning();
  return exam;
};

export const deleteExam = async (id) => {
  const [exam] = await db.delete(exams).where(eq(exams.id, Number(id))).returning();
  return exam;
};
