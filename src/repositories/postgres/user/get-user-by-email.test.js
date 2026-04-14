import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests'
import { PostgresGetUserByEmailRepository } from './get-user-by-email'

describe('Get User By Email Repository', () => {
    it('should get user by email on db', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(user.email)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: user.email,
            },
        })
    })

    it('should throw if Prisma throws an error', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.email)

        await expect(promise).rejects.toThrow()
    })
})
