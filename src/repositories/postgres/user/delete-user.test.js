import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests'
import { PostgresDeleteUserRepository } from './delete-user'

describe('Delete User Repository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })

    it('should return null if user to delete does not exist', async () => {
        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toBeNull()
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({
            data: user,
        })

        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'delete')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })

    it('should throw if Prisma throws an error', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
