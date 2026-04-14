import { prisma } from '../../../../prisma/prisma.js'
import { user } from '../../../tests/index.js'
import { PostgresCreateUserRepository } from './create-user.js'

describe('Create User Repository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result).toEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresCreateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'create')

        await sut.execute(user)

        expect(prismaSpy).toHaveBeenCalledWith({
            data: user,
        })
    })

    it('should throw if Prisma throws an error', async () => {
        const sut = new PostgresCreateUserRepository()
        jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})
