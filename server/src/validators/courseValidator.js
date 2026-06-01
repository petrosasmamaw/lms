import { z } from 'zod'

export const courseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  department_id: z.string().or(z.number()).transform((val) => Number(val))
})
