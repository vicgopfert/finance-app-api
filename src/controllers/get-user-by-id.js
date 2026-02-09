import { GetUserByIdUseCase } from '../use-cases/index.js'
import {
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
    notFound,
} from './helpers/index.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id
            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return badRequest({ message: 'The provided ID is invalid.' })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(userId)

            if (!user) {
                return notFound({ message: 'User not found.' })
            }

            return ok(user)
        } catch (error) {
            console.error('Error getting user by ID:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
