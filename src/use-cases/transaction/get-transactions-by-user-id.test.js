import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { faker } from '@faker-js/faker'
import { transaction, user } from '../../tests/index.js'

describe('Get Transactions by User ID Use Case', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return transactions
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getUserByIdRepository,
            getTransactionsByUserIdRepository,
        )

        return {
            sut,
            getUserByIdRepository,
            getTransactionsByUserIdRepository,
        }
    }

    const transactions = [
        {
            ...transaction,
            type: 'EXPENSE',
        },
        {
            ...transaction,
            type: 'EARNING',
        },
    ]

    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(transactions)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const userId = faker.string.uuid()
        const promise = sut.execute(userId)

        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(getUserByIdSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()

        const getTransactionsByUserIdSpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(getTransactionsByUserIdSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetTransactionsByUserIdRepository throws', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()

        jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        ).mockRejectedValue(new Error())

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow()
    })
})
