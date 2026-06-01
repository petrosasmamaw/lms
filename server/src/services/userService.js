import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all users
export const getAllUsers = async () => {
  return await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });
};

// Get all students
export const getAllStudents = async () => {
  return await db.query.users.findMany({
    where: eq(users.role, 'student'),
    orderBy: [users.name],
  });
};

// Get all admins
export const getAllAdmins = async () => {
  return await db.query.users.findMany({
    where: eq(users.role, 'admin'),
    orderBy: [users.name],
  });
};

// Get user by ID
export const getUserById = async (id) => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

// Get user by email
export const getUserByEmail = async (email) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

// Get user by userId (from Better Auth)
export const getUserByUserId = async (userId) => {
  return await db.query.users.findFirst({
    where: eq(users.userId, userId),
  });
};

// Create user
export const createUser = async (data) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

// Update user
export const updateUser = async (id, data) => {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
};

// Get students by department
export const getStudentsByDepartment = async (departmentId) => {
  return await db.query.users.findMany({
    where: and(
      eq(users.role, 'student'),
      eq(users.departmentId, departmentId)
    ),
  });
};
