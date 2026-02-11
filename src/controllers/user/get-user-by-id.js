import {
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

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

            if (!user) {
                return userNotFoundResponse()
            }

            return ok(user)
        } catch (error) {
            console.error('Error getting user by ID:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
