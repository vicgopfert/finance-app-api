import { DeleteTransactionUseCase } from './delete-transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { faker } from '@faker-js/faker'

describe('Delete Transaction Use Case', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)
        return { sut, deleteTransactionRepository }
    }

    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount(0.01, 10000, 2)),
    }

    it('should delete a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        const deleteTransactionSpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        const transactionId = faker.string.uuid()
        await sut.execute(transactionId)

        expect(deleteTransactionSpy).toHaveBeenCalledWith(transactionId)
    })

    it('should throw TransactionNotFoundError if DeleteTransactionRepository returns null', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockResolvedValueOnce(null)

        const transactionId = faker.string.uuid()
        const promise = sut.execute(transactionId)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transactionId),
        )
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        jest.spyOn(deleteTransactionRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow(new Error())
    })
})
