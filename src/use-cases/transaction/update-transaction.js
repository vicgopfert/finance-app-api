import { TransactionNotFoundError } from '../../errors/transaction.js'

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }

    async execute(transactionId, params) {
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        return transaction
    }
}
