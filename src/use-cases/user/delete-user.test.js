import { DeleteUserUseCase } from './delete-user.js'
import { faker } from '@faker-js/faker'

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

    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    it('should delete a user successfully', async () => {
        const { sut } = makeSut()

        const deletedUser = await sut.execute(faker.string.uuid())

        expect(deletedUser).toEqual(user)
    })
})
