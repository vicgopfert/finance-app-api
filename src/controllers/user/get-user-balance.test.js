import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance.js'

describe('Get User Balance Controller', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
            return faker.number.int()
        }
    }

    const httpRequest = {
        params: {
            id: faker.string.uuid(),
        },
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return { getUserBalanceUseCase, sut }
    }

    it('should returns 200 when getting user balance successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })
})
