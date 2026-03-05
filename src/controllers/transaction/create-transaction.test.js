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

    it('should return 201 when creating a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toHaveProperty(
            'message',
            'Transaction created successfully',
        )
        expect(result.body).toHaveProperty('transaction', httpRequest.body)
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
})
