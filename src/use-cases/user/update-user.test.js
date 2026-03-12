import { UpdateUserUseCase } from './update-user.js'
import { faker } from '@faker-js/faker'

describe('Update User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )
        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        }
    }

    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    it('should update a user successfully (without email and password)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        expect(result).toBe(user)
    })

    it('should update a user successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        const getUserByEmailSpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )

        const email = faker.internet.email()
        const result = await sut.execute(faker.string.uuid(), {
            email,
        })

        expect(getUserByEmailSpy).toHaveBeenCalledWith(email)
        expect(result).toBe(user)
    })
})
