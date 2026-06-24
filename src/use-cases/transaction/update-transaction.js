import { TransactionNotFoundError, ForbiddenError } from '../../errors/index.js'

export class UpdateTransactionUseCase {
    constructor(getTransactionByIdRepository, updateTransactionRepository) {
        this.getTransactionByIdRepository = getTransactionByIdRepository
        this.updateTransactionRepository = updateTransactionRepository
    }

    async execute(transactionId, params) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.user_id !== params.user_id) {
            throw new ForbiddenError()
        }

        const updatedTransaction =
            await this.updateTransactionRepository.execute(
                transactionId,
                params,
            )

        return updatedTransaction
    }
}
