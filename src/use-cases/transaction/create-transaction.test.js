import { CreateTransactionUseCase } from './create-transaction.js'
import { faker } from '@faker-js/faker'

describe('Create Transaction Use Case', () => {
    class CreateTransactionRepositoryUseCase {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryUseCase()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new CreateTransactionUseCase(
            getUserByIdRepository,
            createTransactionRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            idGeneratorAdapter,
            getUserByIdRepository,
        }
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    const createTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount(0.01, 10000, 2)),
    }

    it('should create a transaction successfully', async () => {
        const { sut } = makeSut()

        const createdTransaction = await sut.execute(createTransactionParams)

        expect(createdTransaction).toEqual({
            ...createTransactionParams,
            id: 'generated_id',
        })
    })

    it('should call GetUserByIdRepository with correct user id', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(createTransactionParams)

        expect(getUserByIdSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })
})
