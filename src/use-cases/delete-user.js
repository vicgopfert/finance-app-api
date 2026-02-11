export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }

    async execute(userId) {
        const deleteUserRepository = this.deleteUserRepository
        const deletedUser = await deleteUserRepository.execute(userId)
        return deletedUser
    }
}
