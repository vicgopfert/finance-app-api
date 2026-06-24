import { DeleteTransactionUseCase } from './delete-transaction.js'
import { TransactionNotFoundError, ForbiddenError } from '../../errors/index.js'
import { faker } from '@faker-js/faker'
import { transaction } from '../../tests/index.js'

describe('Delete Transaction Use Case', () => {
    const user_id = faker.string.uuid()

    class GetTransactionByIdRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }
    class DeleteTransactionRepositoryStub {
        async execute() {
            return { ...transaction, user_id }
        }
    }

    const makeSut = () => {
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(
            getTransactionByIdRepository,
            deleteTransactionRepository,
        )
        return {
            sut,
            getTransactionByIdRepository,
            deleteTransactionRepository,
        }
    }

    it('should delete a transaction successfully', async () => {
        const { sut } = makeSut()

        const transactionId = faker.string.uuid()
        const result = await sut.execute(transactionId, user_id)

        expect(result).toEqual({ ...transaction, user_id })
    })

    it('should call GetTransactionByIdRepository with correct params', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()

        const getTransactionByIdSpy = import.meta.jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        )

        const transactionId = faker.string.uuid()
        await sut.execute(transactionId, user_id)

        expect(getTransactionByIdSpy).toHaveBeenCalledWith(transactionId)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        const deleteTransactionSpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        const transactionId = faker.string.uuid()
        await sut.execute(transactionId, user_id)

        expect(deleteTransactionSpy).toHaveBeenCalledWith(transactionId)
    })

    it('should throw TransactionNotFoundError if transaction does not exist', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getTransactionByIdRepository, 'execute')
            .mockResolvedValueOnce(null)

        const transactionId = faker.string.uuid()
        const promise = sut.execute(transactionId, user_id)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transactionId),
        )
    })

    it('should throw ForbiddenError if transaction does not belong to user', async () => {
        const { sut } = makeSut()

        const transactionId = faker.string.uuid()
        const promise = sut.execute(transactionId, faker.string.uuid())

        await expect(promise).rejects.toThrow(new ForbiddenError())
    })

    it('should throw if GetTransactionByIdRepository throws', async () => {
        const { sut, getTransactionByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getTransactionByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(faker.string.uuid(), user_id)

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(faker.string.uuid(), user_id)

        await expect(promise).rejects.toThrow(new Error())
    })
})
