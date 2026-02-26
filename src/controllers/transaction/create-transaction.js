import { createTransactionSchema } from '../../schemas/transaction.js'
import { badRequest, created, serverError } from '../helpers/index.js'

import { z } from 'zod'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createTransactionSchema.parseAsync(params)

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type: params.type.toUpperCase(),
            })

            return created({
                message: 'Transaction created successfully',
                transaction,
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            console.error('Error creating transaction:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
