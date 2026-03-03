import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should returns 201 when creating a user successfully', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toHaveProperty(
            'message',
            'User created successfully',
        )
        expect(result.body).toHaveProperty('user', httpRequest.body)
    })

    // Status 400 when some field is not provided
    it('should returns 400 if first_name is not provided', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field first_name is not provided.',
        )
    })

    it('should returns 400 if last_name is not provided', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field last_name is not provided.',
        )
    })

    it('should returns 400 if email is not provided', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field email is not provided.',
        )
    })

    it('should returns 400 if password is not provided', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'The field password is not provided.',
        )
    })

    // Status 400 when email is not valid
    it('should returns 400 if email is not valid', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'invalid-email',
                password: faker.internet.password({ length: 7 }),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Please provide a valid email address',
        )
    })

    // Status 400 when password is less than 6 characters
    it('should returns 400 if password is less than 6 characters', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 5 }),
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Password must be at least 6 characters long',
        )
    })

    // Verify if CreateUserUseCase is called with correct params
    it('should call CreateUserUseCase with correct params', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const executeSpy = jest.spyOn(createUserUseCaseStub, 'execute')

        await createUserController.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should returns 500 if CreateUserUseCase throws', async () => {
        const createUserUseCaseStub = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(
            createUserUseCaseStub,
        )

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        jest.spyOn(createUserUseCaseStub, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body).toHaveProperty('message', 'Internal server error')
    })
})
