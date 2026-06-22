import { z } from 'zod'

import { UserNotFoundError } from '../../errors/user.js'
import { getUserBalanceSchema } from '../../schemas/user.js'
import { notFound, ok, serverError, badRequest } from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getUserBalanceSchema.parseAsync({ user_id: userId, from, to })

            const balance = await this.getUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(balance)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof UserNotFoundError) {
                return notFound({ message: error.message })
            }
            console.error('Error getting user balance:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
