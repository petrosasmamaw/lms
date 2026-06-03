import { z } from 'zod';

export const courseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  departmentId: z.coerce.number().int().positive(),
  year: z.coerce.number().int().min(1).max(4),
});
