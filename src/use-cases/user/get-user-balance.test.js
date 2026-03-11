import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import { faker } from '@faker-js/faker'

describe('Get User Balance Use Case', () => {
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

    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    const userBalance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investments: faker.finance.amount(),
        balance: faker.finance.amount(),
    }

    it('should get user balance successfully', async () => {
        const { sut } = makeSut()

        const balance = await sut.execute(faker.string.uuid())

        expect(balance).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const userId = faker.string.uuid()
        const balancePromise = sut.execute(userId)

        await expect(balancePromise).rejects.toThrow(
            new UserNotFoundError(userId),
        )
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(getUserByIdSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        const { sut, getUserBalanceRepository } = makeSut()

        const getUserBalanceSpy = jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(getUserBalanceSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const balancePromise = sut.execute(faker.string.uuid())

        await expect(balancePromise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        const { sut, getUserBalanceRepository } = makeSut()

        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const balancePromise = sut.execute(faker.string.uuid())

        await expect(balancePromise).rejects.toThrow()
    })
})
