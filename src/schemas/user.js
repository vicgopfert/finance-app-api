import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string({
            message: 'The field first_name is not provided.',
        })
        .trim()
        .min(1, 'First name is required'),

    last_name: z
        .string({
            message: 'The field last_name is not provided.',
        })
        .trim()
        .min(1, 'Last name is required'),

    email: z
        .string({
            message: 'The field email is not provided.',
        })
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),

    password: z
        .string({
            message: 'The field password is not provided.',
        })
        .min(6, 'Password must be at least 6 characters long'),
})

export const updateUserSchema = createUserSchema
    .partial()
    .strict('Some provided field is not allowed to be updated')

export const getUserBalanceSchema = z.object({
    user_id: z
        .string({
            message: 'The field user_id is not provided.',
        })
        .min(1, { message: 'User ID is required' })
        .uuid({ message: 'Invalid user ID format' }),
    from: z
        .string({
            message: 'The field from is not provided.',
        })
        .min(1, { message: 'From date is required' })
        .date({ message: 'Invalid date format' }),
    to: z
        .string({
            message: 'The field to is not provided.',
        })
        .min(1, { message: 'To date is required' })
        .date({ message: 'Invalid date format' }),
})

export const loginUserSchema = z.object({
    email: z
        .string({
            message: 'The field email is not provided.',
        })
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),

    password: z
        .string({
            message: 'The field password is not provided.',
        })
        .min(6, 'Password must be at least 6 characters long'),
})

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string({
            message: 'The field refreshToken is not provided.',
        })
        .trim()
        .min(1, 'Refresh token is required'),
})
