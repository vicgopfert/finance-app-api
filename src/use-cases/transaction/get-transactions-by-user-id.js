import { userNotFoundResponse } from '../../controllers/helpers'

export class GetTransactionsByUserIdUseCase {
    constructor(getUserByIdRepository, getTransactionsByUserIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
    }

    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            return userNotFoundResponse(params.userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.userId)

        return transactions
    }
}
