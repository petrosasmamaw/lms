import { db } from '../db/index.js';
import { departments, courses } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all departments
export const getAllDepartments = async () => {
  return await db.query.departments.findMany({
    orderBy: [desc(departments.createdAt)],
  });
};

// Get department by ID
export const getDepartmentById = async (id) => {
  return await db.query.departments.findFirst({
    where: eq(departments.id, id),
  });
};

// Create department
export const createDepartment = async (data) => {
  const [dept] = await db.insert(departments).values(data).returning();
  return dept;
};

// Update department
export const updateDepartment = async (id, data) => {
  const [dept] = await db
    .update(departments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(departments.id, id))
    .returning();
  return dept;
};

// Delete department
export const deleteDepartment = async (id) => {
  const [dept] = await db
    .delete(departments)
    .where(eq(departments.id, id))
    .returning();
  return dept;
};

// Get department with academic years
export const getDepartmentWithYears = async (id) => {
  const dept = await getDepartmentById(id);
  if (!dept) return null;
  // collect distinct years from courses for this department
  const deptCourses = await db.query.courses.findMany({ where: eq(courses.departmentId, id) });
  const years = Array.from(new Set(deptCourses.map((c) => c.year))).sort();
  return { ...dept, academicYears: years };
};

// Get department with all data (years, courses, resources, exams)
export const getDepartmentFull = async (id) => {
  const dept = await getDepartmentWithYears(id);
  if (!dept) return null;

  const yearData = await Promise.all(
    dept.academicYears.map(async (yr) => {
      const yearCourses = await db.query.courses.findMany({
        where: eq(courses.year, yr),
      });
      return { year: yr, courses: yearCourses };
    })
  );

  return { ...dept, academicYears: yearData };
};
