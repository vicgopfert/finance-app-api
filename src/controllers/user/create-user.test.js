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
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
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
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
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
                first_name: 'John',
                email: 'john.doe@example.com',
                password: 'password123',
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
                first_name: 'John',
                last_name: 'Doe',
                password: 'password123',
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
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
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
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doeexample.com',
                password: 'password123',
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
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: 'pass',
            },
        }

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body).toHaveProperty(
            'message',
            'Password must be at least 6 characters long',
        )
    })
})
