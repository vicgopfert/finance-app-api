import { TransactionNotFoundError } from '../../errors/transaction.js'

export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId) {
        const transaction =
            await this.deleteTransactionRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        return transaction
    }
}
