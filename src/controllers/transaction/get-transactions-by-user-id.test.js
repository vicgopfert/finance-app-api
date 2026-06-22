import { UserNotFoundError } from '../../errors/user'
import { transaction } from '../../tests/index.js'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { faker } from '@faker-js/faker'

describe('Get Transactions By User ID Controller', () => {
    const from = '2026-01-01'
    const to = '2026-01-31'

    class GetUserByIdUseCaseStub {
        async execute() {
            return transaction
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
            from,
            to,
        },
    }

    it('should return 200 when finding transactions successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            query: { userId: undefined, from, to },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            query: { userId: 'invalid-user-id', from, to },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if GetTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(
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

        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body).toHaveProperty('message', 'Internal server error')
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.query.userId,
            httpRequest.query.from,
            httpRequest.query.to,
        )
    })
})
