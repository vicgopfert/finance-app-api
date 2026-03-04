import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse(userId)
            }

            const balance = await this.getUserBalanceUseCase.execute({ userId })

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return notFound({ message: error.message })
            }
            console.error('Error getting user balance:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
