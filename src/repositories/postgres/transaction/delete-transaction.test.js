import { PostgresDeleteTransactionRepository } from './delete-transaction'
import {
    transaction as fakeTransaction,
    user as fakeUser,
} from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import dayjs from 'dayjs'

describe('Delete Transaction Repository', () => {
    const createUserAndTransactionOnDb = async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const transaction = await prisma.transaction.create({
            data: { ...fakeTransaction, user_id: user.id },
        })

        return { user, transaction }
    }

    it('should delete a transaction successfully', async () => {
        const { user, transaction } = await createUserAndTransactionOnDb()
        const sut = new PostgresDeleteTransactionRepository()

        const result = await sut.execute(transaction.id)

        expect(result.name).toBe(transaction.name)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })

    it('should call Prisma with correct params', async () => {
        const { transaction } = await createUserAndTransactionOnDb()
        const sut = new PostgresDeleteTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'delete')

        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        })
    })
})
