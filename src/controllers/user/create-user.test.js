import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { user } from '../../tests/index.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            ...user,
            id: undefined,
        },
    }

    it('should returns 201 when creating a user successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toHaveProperty(
            'message',
            'User created successfully',
        )
        expect(result.body).toHaveProperty('user', user)
    })

    it('should returns 400 if first_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field first_name is not provided.',
        )
    })

    it('should returns 400 if last_name is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field last_name is not provided.',
        )
    })

    it('should returns 400 if email is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field email is not provided.',
        )
    })

    it('should returns 400 if password is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field password is not provided.',
        )
    })

    it('should returns 400 if email is not valid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
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

    it('should returns 500 if CreateUserUseCase throws EmailIsAlreadyInUse error', async () => {
        const { sut, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            `Email ${httpRequest.body.email} is already in use.`,
        )
    })

    it('should returns 400 if password is less than 6 characters', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
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

    it('should returns 500 if CreateUserUseCase throws an unexpected error', async () => {
        const { sut, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body).toHaveProperty('message', 'Internal server error')
    })

    it('should call CreateUserUseCase with correct params', async () => {
        const { sut, createUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
