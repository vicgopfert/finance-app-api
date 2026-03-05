import { UpdateUserController } from './update-user.js'
import { UserNotFoundError } from '../../errors/user.js'
import { faker } from '@faker-js/faker'

describe('Update User Controller', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)
        return { sut, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            id: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        },
    }

    it('should return 200 when updating a user successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toHaveProperty(
            'message',
            'User updated successfully',
        )
        expect(result.body).toHaveProperty('user')
    })

    it('should return 400 if user id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                id: 'invalid-id',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The provided ID invalid-id is invalid.',
        )
    })

    it('should return 404 if user is not found', async () => {
        const { sut, updateUserUseCase } = makeSut()

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(httpRequest.params.id),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
        expect(result.body).toHaveProperty(
            'message',
            `User with id ${httpRequest.params.id} not found.`,
        )
    })

    it('should return 400 if and invalid email is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                email: 'invalid-email',
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Please provide a valid email address',
        )
    })

    it('should return 400 if and invalid email is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Password must be at least 6 characters long',
        )
    })
})
