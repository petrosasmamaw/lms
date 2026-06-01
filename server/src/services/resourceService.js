import { db } from '../db/index.js';
import { resources } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Get all resources
export const getAllResources = async () => {
  return await db.query.resources.findMany({
    orderBy: [desc(resources.createdAt)],
  });
};

// Get resources by course
export const getResourcesByCourse = async (courseId) => {
  return await db.query.resources.findMany({
    where: eq(resources.courseId, courseId),
    orderBy: [desc(resources.createdAt)],
  });
};

// Get resource by ID
export const getResourceById = async (id) => {
  return await db.query.resources.findFirst({
    where: eq(resources.id, id),
  });
};

// Create resource
export const createResource = async (data) => {
  const [resource] = await db.insert(resources).values(data).returning();
  return resource;
};

// Update resource
export const updateResource = async (id, data) => {
  const [resource] = await db
    .update(resources)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning();
  return resource;
};

// Delete resource
export const deleteResource = async (id) => {
  const [resource] = await db
    .delete(resources)
    .where(eq(resources.id, id))
    .returning();
  return resource;
};
