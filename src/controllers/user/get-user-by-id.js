import {
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
    notFound,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id
            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return badRequest({ message: 'The provided ID is invalid.' })
            }

            const user = await this.getUserByIdUseCase.execute(userId)

            return ok(user)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return notFound({ message: error.message })
            }
            console.error('Error getting user by ID:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
