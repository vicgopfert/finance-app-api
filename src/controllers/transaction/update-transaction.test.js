import { UpdateTransactionController } from './update-transaction'
import { TransactionNotFoundError } from '../../errors/transaction'
import { faker } from '@faker-js/faker'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
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
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)
        return { updateTransactionUseCase, sut }
    }

    const httpRequest = {
        params: {
            id: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount(0.01, 10000, 2)),
        },
    }

    it('should return 200 when updating a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toHaveProperty(
            'message',
            'Transaction updated successfully',
        )
        expect(result.body).toHaveProperty('transaction')
    })

    it('should return 400 if transaction id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                id: 'invalid-uuid',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The provided ID invalid-uuid is invalid.',
        )
    })

    it('should return 404 if UpdateTransactionUseCase throws TransactionNotFoundError', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new TransactionNotFoundError(httpRequest.params.id),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
        expect(result.body).toHaveProperty(
            'message',
            `Transaction with id ${httpRequest.params.id} not found.`,
        )
    })

    it('should return 400 when an unallowed field is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                unallowed_field: 'unallowed_value',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Some provided field is not allowed to be updated',
        )
    })

    it('should return 400 if date is in an invalid format', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                date: 'invalid-date',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty('message', 'Invalid date format')
    })

    it('should return 400 if amount is not a valid currency', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
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
            ...httpRequest,
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

    it('should return 400 if type is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
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

    it('should return 500 if UpdateTransactionUseCase throws an unexpected error', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body).toHaveProperty('message', 'Internal server error')
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.id,
            httpRequest.body,
        )
    })
})
