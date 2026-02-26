import { z } from 'zod'

export const createTransactionSchema = z.object({
    user_id: z
        .string()
        .min(1, { message: 'User ID is required' })
        .uuid({ message: 'Invalid user ID format' }),
    name: z.string().trim().min(1, { message: 'Name is required' }),
    date: z
        .string()
        .min(1, { message: 'Date is required' })
        .datetime({ message: 'Invalid date format' }),
    type: z
        .string()
        .min(1, { message: 'Type is required' })
        .transform((val) => val.toUpperCase())
        .refine((val) => ['EXPENSE', 'EARNING', 'INVESTMENT'].includes(val), {
            message: 'Type must be EXPENSE, EARNING, or INVESTMENT',
        }),

    amount: z.coerce
        .number('Amount must be a number')
        .min(0.01, { message: 'Amount must be greater than 0' }),
})
