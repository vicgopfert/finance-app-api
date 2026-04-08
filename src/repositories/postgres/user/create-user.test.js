import { user } from '../../../tests/index.js'
import { PostgresCreateUserRepository } from './create-user.js'

describe('Create User Repository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result).toEqual(user)
    })
})
