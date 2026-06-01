import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'student']),
  department_id: z.string().nullable().optional(),
  student_id: z.string().nullable().optional()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
