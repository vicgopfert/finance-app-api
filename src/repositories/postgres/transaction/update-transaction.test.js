import { PostgresUpdateTransactionRepository } from './update-transaction'
import { prisma } from '../../../../prisma/prisma'
import {
    user as fakeUser,
    transaction as fakeTransaction,
} from '../../../tests'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

describe('Update Transaction Repository', () => {
    const createUserAndTransactionOnDb = async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const transaction = await prisma.transaction.create({
            data: { ...fakeTransaction, user_id: user.id },
        })

        return { user, transaction }
    }

    it('should update a transaction successfully', async () => {
        const { user, transaction } = await createUserAndTransactionOnDb()
        const sut = new PostgresUpdateTransactionRepository()
        const updateTransactionParams = {
            user_id: user.id,
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount(0.01, 10000, 2)),
        }

        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        )

        expect(result.id).toBe(transaction.id)
        expect(result.user_id).toBe(user.id)
        expect(result.name).toBe(updateTransactionParams.name)
        expect(result.type).toBe(updateTransactionParams.type)
        expect(String(result.amount)).toBe(
            String(updateTransactionParams.amount),
        )
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(updateTransactionParams.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(
            dayjs(updateTransactionParams.date).month(),
        )
        expect(dayjs(result.date).year()).toBe(
            dayjs(updateTransactionParams.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        const { transaction } = await createUserAndTransactionOnDb()
        const sut = new PostgresUpdateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transaction.id, transaction)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: transaction,
        })
    })

    it('should throw if Prisma throws an error', async () => {
        const { transaction } = await createUserAndTransactionOnDb()
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction.id, transaction)

        await expect(promise).rejects.toThrow()
    })
})
