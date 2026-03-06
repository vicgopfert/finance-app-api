import { UserNotFoundError } from '../../errors/user'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { faker } from '@faker-js/faker'

describe('Get Transactions By User ID Controller', () => {
    class GetUserByIdUseCaseStub {
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
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase)
        return { getUserByIdUseCase, sut }
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

    it('should return 400 if userId is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({ query: { userId: undefined } })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Field userId is required.',
        )
    })

    it('should return 400 if userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            query: { userId: 'invalid-user-id' },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The provided ID invalid-user-id is invalid.',
        )
    })

    it('should return 404 if user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(httpRequest.query.userId),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
        expect(result.body).toHaveProperty(
            'message',
            `User with id ${httpRequest.query.userId} not found.`,
        )
    })

    it('should return 500 if GetUserByIdUseCase throws an unexpected error', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body).toHaveProperty('message', 'Internal server error')
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId)
    })
})
