import { DeleteUserUseCase } from './delete-user.js'
import { UserNotFoundError } from '../../errors/user.js'
import { faker } from '@faker-js/faker'
import { user } from '../../tests/index.js'

describe('Delete User Use Case', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)
        return { sut, deleteUserRepository }
    }

    it('should delete a user successfully', async () => {
        const { sut } = makeSut()

        const deletedUser = await sut.execute(faker.string.uuid())

        expect(deletedUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        const { sut, deleteUserRepository } = makeSut()

        const deleteSpy = jest.spyOn(deleteUserRepository, 'execute')

        const userId = faker.string.uuid()
        await sut.execute(userId)

        expect(deleteSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw an UserNotFoundError if DeleteUserRepository returns null', async () => {
        const { sut, deleteUserRepository } = makeSut()

        jest.spyOn(deleteUserRepository, 'execute').mockResolvedValueOnce(null)

        const userId = faker.string.uuid()

        expect(sut.execute(userId)).rejects.toThrow(
            new UserNotFoundError(userId),
        )
    })

    it('should throw if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makeSut()

        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid())

        expect(promise).rejects.toThrow(new Error())
    })
})
