import { v4 as uuidv4 } from 'uuid'
import { UserNotFoundError } from '../../errors/user'

export class CreateTransactionUseCase {
    constructor(getUserByIdRepository, createTransactionRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.createTransactionRepository = createTransactionRepository
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.userId
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })

        return transaction
    }
}
