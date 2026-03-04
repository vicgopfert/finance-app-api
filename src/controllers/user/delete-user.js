import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    notFound,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id
            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse(userId)
            }

            const deleteUserUseCase = this.deleteUserUseCase
            const deletedUser = await deleteUserUseCase.execute(userId)

            return ok({
                message: 'User deleted successfully',
                user: deletedUser,
            })
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return notFound({ message: error.message })
            }
            console.error('Error deleting user:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
