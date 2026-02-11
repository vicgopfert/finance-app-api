import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from './helpers/index.js'

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

            if (!deletedUser) {
                return userNotFoundResponse()
            }

            return ok({
                message: 'User deleted successfully',
                user: deletedUser,
            })
        } catch (error) {
            console.error('Error deleting user:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
