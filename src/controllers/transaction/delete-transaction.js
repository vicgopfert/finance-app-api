import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.id

            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse(transactionId)
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            return ok({
                message: 'Transaction deleted successfully',
                transaction: deletedTransaction,
            })
        } catch (error) {
            console.error('Error deleting transaction:', error)
            return serverError()
        }
    }
}
