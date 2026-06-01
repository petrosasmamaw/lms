import { db } from '../db/index.js';
import { courses, resources, exams } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all courses
export const getAllCourses = async () => {
  return await db.query.courses.findMany({
    orderBy: [desc(courses.createdAt)],
  });
};

// Get courses by department
export const getCoursesByDepartment = async (departmentId) => {
  return await db.query.courses.findMany({
    where: eq(courses.departmentId, departmentId),
    orderBy: [courses.name],
  });
};

// Get courses by academic year
export const getCoursesByAcademicYear = async (academicYearId) => {
  return await db.query.courses.findMany({
    where: eq(courses.academicYearId, academicYearId),
    orderBy: [courses.name],
  });
};

// Get course by ID
export const getCourseById = async (id) => {
  return await db.query.courses.findFirst({
    where: eq(courses.id, id),
  });
};

// Create course
export const createCourse = async (data) => {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
};

// Update course
export const updateCourse = async (id, data) => {
  const [course] = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();
  return course;
};

// Delete course
export const deleteCourse = async (id) => {
  const [course] = await db
    .delete(courses)
    .where(eq(courses.id, id))
    .returning();
  return course;
};

// Get course with resources and exams
export const getCourseWithContent = async (id) => {
  const course = await getCourseById(id);
  if (!course) return null;

  const courseResources = await db.query.resources.findMany({
    where: eq(resources.courseId, id),
  });

  const courseExams = await db.query.exams.findMany({
    where: eq(exams.courseId, id),
  });

  return {
    ...course,
    resources: courseResources,
    exams: courseExams,
  };
};
