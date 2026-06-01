import { db } from '../db/index.js';
import { courses } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Return distinct years found in courses (optionally filtered by departmentId)
export const getAllAcademicYears = async (departmentId) => {
  const where = departmentId ? eq(courses.departmentId, departmentId) : undefined;
  const rows = await db.select({ year: courses.year }).from(courses).where(where).groupBy(courses.year).orderBy(courses.year);
  return rows.map((r) => r.year).filter((y) => y != null);
};

export const getAcademicYearWithCourses = async (year, departmentId) => {
  const where = departmentId ? (eq(courses.departmentId, departmentId)) : undefined;
  const rows = await db.query.courses.findMany({
    where: where ? where.and(eq(courses.year, year)) : eq(courses.year, year),
  });
  return { year, courses: rows };
};
