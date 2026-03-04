import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'

describe('Get User By ID Controller', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)
        return { getUserByIdUseCase, sut }
    }

    const httpRequest = {
        params: {
            id: faker.string.uuid(),
        },
    }

    it('should returns 200 when getting user by ID successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should returns 400 if user id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                id: 'invalid-id',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The provided ID is invalid.',
        )
    })
})
