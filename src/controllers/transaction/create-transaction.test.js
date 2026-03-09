import { UserNotFoundError } from '../../errors/user.js'
import { CreateTransactionController } from './create-transaction.js'
import { faker } from '@faker-js/faker'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)
        return { createTransactionUseCase, sut }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount(0.01, 10000, 2)),
        },
    }

    it('should return 201 when creating a transaction successfully (expense)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toHaveProperty(
            'message',
            'Transaction created successfully',
        )
        expect(result.body).toHaveProperty('transaction')
    })

    it('should return 201 when creating a transaction successfully (earning)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'EARNING',
            },
        })

        expect(result.statusCode).toBe(201)
        expect(result.body).toHaveProperty(
            'message',
            'Transaction created successfully',
        )
        expect(result.body).toHaveProperty('transaction')
    })

    it('should return 201 when creating a transaction successfully (investment)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'INVESTMENT',
            },
        })

        expect(result.statusCode).toBe(201)
        expect(result.body).toHaveProperty(
            'message',
            'Transaction created successfully',
        )
        expect(result.body).toHaveProperty('transaction')
    })

    it('should return 400 if user_id is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                user_id: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field user_id is not provided.',
        )
    })

    it('should return 400 if name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field name is not provided.',
        )
    })

    it('should return 400 if date is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                date: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field date is not provided.',
        )
    })

    it('should return 400 if type is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field type is not provided.',
        )
    })

    it('should return 400 if amount is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if date is in an invalid format', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                date: 'invalid-date',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty('message', 'Invalid date format')
    })

    it('should return 400 if type is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Type must be EXPENSE, EARNING, or INVESTMENT',
        )
    })

    it('should return 400 if amount is not a valid currency', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: 'invalid-amount',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty('message', 'Amount must be a number')
    })

    it('should return 400 if amount is less than or equal to 0', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: -10,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Amount must be greater than 0',
        )
    })

    it('should return 400 if user_id is in an invalid format', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                user_id: 'invalid-uuid',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty('message', 'Invalid user ID format')
    })

    it('should return 500 if CreateTransactionUseCase throws UserNotFoundError', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(httpRequest.body.user_id),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
        expect(result.body).toHaveProperty(
            'message',
            `User with id ${httpRequest.body.user_id} not found.`,
        )
    })

    it('should return 500 if CreateTransactionUseCase throws an unexpected error', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body).toHaveProperty('message', 'Internal server error')
    })

    it('should call CreateTransactionUseCase with correct params', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
