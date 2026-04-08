import { UpdateUserUseCase } from './update-user.js'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'
import { faker } from '@faker-js/faker'
import { user } from '../../tests/index.js'

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

    it('should update a user successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()

        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')

        const password = faker.internet.password()
        const result = await sut.execute(faker.string.uuid(), {
            password,
        })

        expect(passwordHasherSpy).toHaveBeenCalledWith(password)
        expect(result).toBe(user)
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            user,
        )

        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call UpdateUserRepository with correct params', async () => {
        const { sut, updateUserRepository, passwordHasherAdapter } = makeSut()

        const updateUserSpy = jest.spyOn(updateUserRepository, 'execute')
        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')

        const updatedUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        }

        await sut.execute(user.id, updatedUserParams)

        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(updateUserSpy).toHaveBeenCalledWith(user.id, {
            ...updatedUserParams,
            password: 'hashed_password',
        })
    })

    it('should throw UserNotFoundError if UpdateUserRepository returns null', async () => {
        const { sut, updateUserRepository } = makeSut()

        jest.spyOn(updateUserRepository, 'execute').mockResolvedValue(null)

        const userId = faker.string.uuid()
        const promise = sut.execute(userId, {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        })

        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid(), {
            email: faker.internet.email(),
        })

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()

        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid(), {
            password: faker.internet.password(),
        })

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if UpdateUserRepository throws', async () => {
        const { sut, updateUserRepository } = makeSut()

        jest.spyOn(updateUserRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        })

        await expect(promise).rejects.toThrow(new Error())
    })
})
