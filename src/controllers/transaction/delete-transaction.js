import { TransactionNotFoundError } from '../../errors/transaction.js'
import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    notFound,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.id
            const userId = httpRequest.params.user_id

            const transactionIsValid = checkIfIdIsValid(transactionId)
            const userIdIsValid = checkIfIdIsValid(userId)

            if (!transactionIsValid || !userIdIsValid) {
                return invalidIdResponse(
                    !transactionIsValid ? transactionId : userId,
                )
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    transactionId,
                    userId,
                )

            return ok({
                message: 'Transaction deleted successfully',
                transaction: deletedTransaction,
            })
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return notFound({
                    message: error.message,
                })
            }
            console.error('Error deleting transaction:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
