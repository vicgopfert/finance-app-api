import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/index.js'
import { faker } from '@faker-js/faker'
import { user, userBalance } from '../../tests/index.js'

describe('Get User Balance Use Case', () => {
    const from = '2024-01-01'
    const to = '2024-01-31'

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserByIdRepository,
            getUserBalanceRepository,
        )
        return { sut, getUserByIdRepository, getUserBalanceRepository }
    }

    it('should get user balance successfully', async () => {
        const { sut } = makeSut()

        const balance = await sut.execute(faker.string.uuid(), from, to)

        expect(balance).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)

        const userId = faker.string.uuid()
        const balancePromise = sut.execute(userId, from, to)

        await expect(balancePromise).rejects.toThrow(
            new UserNotFoundError(userId),
        )
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const getUserByIdSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        const userId = faker.string.uuid()
        await sut.execute(userId, from, to)

        expect(getUserByIdSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        const { sut, getUserBalanceRepository } = makeSut()

        const getUserBalanceSpy = import.meta.jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )

        const userId = faker.string.uuid()
        await sut.execute(userId, from, to)

        expect(getUserBalanceSpy).toHaveBeenCalledWith(userId, from, to)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValue(new Error())

        const balancePromise = sut.execute(faker.string.uuid(), from, to)

        await expect(balancePromise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        const { sut, getUserBalanceRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserBalanceRepository, 'execute')
            .mockRejectedValue(new Error())

        const balancePromise = sut.execute(faker.string.uuid(), from, to)

        await expect(balancePromise).rejects.toThrow()
    })
})
