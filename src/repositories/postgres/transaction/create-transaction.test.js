import { PostgresCreateTransactionRepository } from './create-transaction'
import { transaction, user } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import dayjs from 'dayjs'

describe('Create Transaction Use Case', () => {
    it('should create a transaction successfully', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({ ...transaction, user_id: user.id })

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
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')

        await sut.execute({ ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            data: {
                id: transaction.id,
                user_id: user.id,
                name: transaction.name,
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
            },
        })
    })

    it('should throw if Prisma throws an error', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()
        jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute({ ...transaction, user_id: user.id })

        await expect(promise).rejects.toThrow()
    })
})
