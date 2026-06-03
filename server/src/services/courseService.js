import { db } from '../db/index.js';
import { courses } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export const getAllCourses = async () => {
  return db.query.courses.findMany({ orderBy: [desc(courses.createdAt)] });
};

export const getCoursesByDepartmentAndYear = async (departmentId, year) => {
  const conditions = [eq(courses.departmentId, Number(departmentId))];
  if (year !== undefined && year !== null && year !== '') {
    conditions.push(eq(courses.year, Number(year)));
  }
  return db.query.courses.findMany({
    where: and(...conditions),
    orderBy: [courses.name],
  });
};

export const getCourseById = async (id) => {
  return db.query.courses.findFirst({ where: eq(courses.id, Number(id)) });
};

export const createCourse = async (data) => {
  const [course] = await db.insert(courses).values({
    name: data.name,
    departmentId: Number(data.departmentId),
    year: Number(data.year),
  }).returning();
  return course;
};

export const updateCourse = async (id, data) => {
  const [course] = await db
    .update(courses)
    .set(data)
    .where(eq(courses.id, Number(id)))
    .returning();
  return course;
};

export const deleteCourse = async (id) => {
  const [course] = await db.delete(courses).where(eq(courses.id, Number(id))).returning();
  return course;
};
