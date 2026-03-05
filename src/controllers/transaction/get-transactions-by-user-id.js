import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    requiredFieldIsMissingResponse,
    serverError,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse(userId)
            }

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({ userId })

            return ok(transactions)
        } catch (error) {
            console.error('Error getting transactions by user id:', error)

            if (error instanceof UserNotFoundError) {
                return notFound({ message: error.message })
            }

            return serverError({ message: 'Internal server error' })
        }
    }
}
