import { z } from 'zod'

import { UserNotFoundError } from '../../errors/index.js'
import { getTransactionsByUserIdSchema } from '../../schemas/transaction.js'
import { notFound, ok, serverError, badRequest } from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionsByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(
                    userId,
                    from,
                    to,
                )

            return ok(transactions)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof UserNotFoundError) {
                return notFound({ message: error.message })
            }

            console.error('Error getting transactions by user id:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
