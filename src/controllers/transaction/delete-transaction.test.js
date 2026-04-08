import { DeleteTransactionController } from './delete-transaction'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { transaction } from '../../tests/index.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const httpRequest = {
        params: {
            id: transaction.id,
        },
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)
        return { deleteTransactionUseCase, sut }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toHaveProperty(
            'message',
            'Transaction deleted successfully',
        )
        expect(result.body).toHaveProperty('transaction')
    })

    it('should return 400 if transaction id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                id: 'invalid-uuid',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The provided ID invalid-uuid is invalid.',
        )
    })

    it('should return 404 if DeleteTransactionUseCase throws TransactionNotFoundError', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new TransactionNotFoundError(httpRequest.params.id),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
        expect(result.body).toHaveProperty(
            'message',
            `Transaction with id ${httpRequest.params.id} not found.`,
        )
    })

    it('should return 500 if DeleteTransactionUseCase throws an unexpected error', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body).toHaveProperty('message', 'Internal server error')
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.id)
    })
})
