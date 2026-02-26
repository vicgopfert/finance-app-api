import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z.string().trim().min(1, 'First name is required'),

    last_name: z.string().trim().min(1, 'Last name is required'),

    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),

    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const updateUserSchema = createUserSchema
    .partial()
    .strict('Some provided field is not allowed to be updated')
