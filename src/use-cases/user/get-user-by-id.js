import { UserNotFoundError } from '../../errors/user.js'

export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        return user
    }
}
