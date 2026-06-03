import { db } from '../db/index.js';
import { user, departments } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export const getUserByEmail = async (email) => {
  return db.query.user.findFirst({ where: eq(user.email, email) });
};

export const getUserById = async (id) => {
  return db.query.user.findFirst({ where: eq(user.id, id) });
};

export const updateUserProfile = async (id, data) => {
  const [updated] = await db
    .update(user)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(user.id, id))
    .returning();
  return updated;
};

export const listStudents = async ({ departmentId, year }) => {
  const conditions = [eq(user.role, 'student')];
  if (departmentId) conditions.push(eq(user.departmentId, Number(departmentId)));
  if (year) conditions.push(eq(user.year, Number(year)));

  return db
    .select()
    .from(user)
    .where(and(...conditions))
    .orderBy(desc(user.createdAt));
};

export const validateDepartment = async (departmentId) => {
  if (!departmentId) return false;
  const dept = await db.query.departments.findFirst({
    where: eq(departments.id, Number(departmentId)),
  });
  return Boolean(dept);
};
