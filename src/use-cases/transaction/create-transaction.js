import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(
        getUserByIdRepository,
        createTransactionRepository,
        idGeneratorAdapter,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.createTransactionRepository = createTransactionRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = await this.idGeneratorAdapter.execute()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
