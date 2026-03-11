import { GetUserBalanceUseCase } from './get-user-balance.js'
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
})
