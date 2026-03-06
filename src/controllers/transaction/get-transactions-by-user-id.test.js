import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { faker } from '@faker-js/faker'

describe('Get Transactions By User ID Controller', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount(0.01, 10000, 2)),
            }
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )
        return { getTransactionsByUserIdUseCase, sut }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when finding transactions successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })
})
