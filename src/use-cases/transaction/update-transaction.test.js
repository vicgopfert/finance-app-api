import { UpdateTransactionUseCase } from './update-transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests/index.js'

describe('Update Transaction Use Case', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return {
            sut,
            updateTransactionRepository,
        }
    }

    const updateTransactionParams = {
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: 'EARNING',
        amount: Number(faker.finance.amount(0.01, 10000, 2)),
    }

    it('should update a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            faker.string.uuid(),
            updateTransactionParams,
        )

        expect(result).toEqual(transaction)
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        const updateTransactionSpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        const transactionId = faker.string.uuid()
        await sut.execute(transactionId, updateTransactionParams)

        expect(updateTransactionSpy).toHaveBeenCalledWith(
            transactionId,
            updateTransactionParams,
        )
    })

    it('should throw TransactionNotFoundError if UpdateTransactionRepository returns null', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockResolvedValueOnce(null)

        const transactionId = faker.string.uuid()
        const promise = sut.execute(transactionId, updateTransactionParams)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transactionId),
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        jest.spyOn(updateTransactionRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(
            faker.string.uuid(),
            updateTransactionParams,
        )

        await expect(promise).rejects.toThrow(new Error())
    })
})
