import { UpdateTransactionUseCase } from './update-transaction.js'
import { TransactionNotFoundError, ForbiddenError } from '../../errors/index.js'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests/index.js'

describe('Update Transaction Use Case', () => {
    class GetTransactionByIdRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(
            getTransactionByIdRepository,
            updateTransactionRepository,
        )

        return {
            getTransactionByIdRepository,
            sut,
            updateTransactionRepository,
        }
    }

    const updateTransactionParams = {
        user_id: transaction.user_id,
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

        const updateTransactionSpy = import.meta.jest.spyOn(
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

    it('should throw TransactionNotFoundError if GetTransactionByIdRepository returns null', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getTransactionByIdRepository, 'execute')
            .mockResolvedValueOnce(null)

        const transactionId = faker.string.uuid()
        const promise = sut.execute(transactionId, updateTransactionParams)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transactionId),
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(updateTransactionRepository, 'execute')
            .mockRejectedValue(new Error())

        const promise = sut.execute(
            faker.string.uuid(),
            updateTransactionParams,
        )

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw ForbiddenError if transaction belongs to another user', async () => {
        const { sut } = makeSut()

        const promise = sut.execute(faker.string.uuid(), {
            ...updateTransactionParams,
            user_id: faker.string.uuid(),
        })

        await expect(promise).rejects.toThrow(new ForbiddenError())
    })
})
