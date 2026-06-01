import { db } from '../db/index.js';
import { academicYears, courses } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all academic years
export const getAllAcademicYears = async () => {
  return await db.query.academicYears.findMany({
    orderBy: [desc(academicYears.createdAt)],
  });
};

// Get academic years by department
export const getAcademicYearsByDepartment = async (departmentId) => {
  return await db.query.academicYears.findMany({
    where: eq(academicYears.departmentId, departmentId),
    orderBy: [academicYears.yearName],
  });
};

// Get academic year by ID
export const getAcademicYearById = async (id) => {
  return await db.query.academicYears.findFirst({
    where: eq(academicYears.id, id),
  });
};

// Create academic year
export const createAcademicYear = async (data) => {
  const [year] = await db.insert(academicYears).values(data).returning();
  return year;
};

// Update academic year
export const updateAcademicYear = async (id, data) => {
  const [year] = await db
    .update(academicYears)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(academicYears.id, id))
    .returning();
  return year;
};

// Delete academic year
export const deleteAcademicYear = async (id) => {
  const [year] = await db
    .delete(academicYears)
    .where(eq(academicYears.id, id))
    .returning();
  return year;
};

// Get academic year with courses
export const getAcademicYearWithCourses = async (id) => {
  const year = await getAcademicYearById(id);
  if (!year) return null;

  const yearCourses = await db.query.courses.findMany({
    where: eq(courses.academicYearId, id),
  });

  return { ...year, courses: yearCourses };
};
