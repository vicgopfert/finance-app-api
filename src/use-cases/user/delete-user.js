import { UserNotFoundError } from '../../errors/index.js'

export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }

    async execute(userId) {
        const deletedUser = await this.deleteUserRepository.execute(userId)

        if (!deletedUser) {
            throw new UserNotFoundError(userId)
        }

        return deletedUser
    }
}
