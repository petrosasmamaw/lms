import { db } from '../db/index.js';
import { enrollments, courses } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all enrollments
export const getAllEnrollments = async () => {
  return await db.query.enrollments.findMany({
    orderBy: [desc(enrollments.enrolledAt)],
  });
};

// Get enrollments by student
export const getEnrollmentsByStudent = async (studentId) => {
  return await db.query.enrollments.findMany({
    where: eq(enrollments.studentId, studentId),
  });
};

// Get enrollments by course
export const getEnrollmentsByCourse = async (courseId) => {
  return await db.query.enrollments.findMany({
    where: eq(enrollments.courseId, courseId),
  });
};

// Get enrollment by ID
export const getEnrollmentById = async (id) => {
  return await db.query.enrollments.findFirst({
    where: eq(enrollments.id, id),
  });
};

// Create enrollment
export const createEnrollment = async (data) => {
  const [enrollment] = await db.insert(enrollments).values(data).returning();
  return enrollment;
};

// Update enrollment
export const updateEnrollment = async (id, data) => {
  const [enrollment] = await db
    .update(enrollments)
    .set(data)
    .where(eq(enrollments.id, id))
    .returning();
  return enrollment;
};

// Delete enrollment
export const deleteEnrollment = async (id) => {
  const [enrollment] = await db
    .delete(enrollments)
    .where(eq(enrollments.id, id))
    .returning();
  return enrollment;
};

// Get student courses
export const getStudentCourses = async (studentId) => {
  return await db.query.enrollments.findMany({
    where: eq(enrollments.studentId, studentId),
  });
};
