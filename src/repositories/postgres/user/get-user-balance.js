import { prisma } from '../../../../prisma/prisma.js'
import { Prisma, TransactionType } from '@prisma/client'

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFilter = {
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        }

        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EXPENSE,
                ...dateFilter,
            },
            _sum: { amount: true },
        })

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EARNING,
                ...dateFilter,
            },
            _sum: { amount: true },
        })

        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.INVESTMENT,
                ...dateFilter,
            },
            _sum: { amount: true },
        })

        const earnings = totalEarnings ?? new Prisma.Decimal(0)
        const expenses = totalExpenses ?? new Prisma.Decimal(0)
        const investments = totalInvestments ?? new Prisma.Decimal(0)

        const total = earnings.plus(expenses).plus(investments)
        const balance = earnings.minus(expenses).minus(investments)

        const calcPercentage = (value, total) =>
            total.equals(0)
                ? 0
                : value
                      .dividedBy(total)
                      .times(100)
                      .toDecimalPlaces(0)
                      .toFixed(0)

        const earningsPercentage = calcPercentage(earnings, total)
        const expensesPercentage = calcPercentage(expenses, total)
        const investmentsPercentage = calcPercentage(investments, total)

        return {
            earnings: earnings,
            expenses: expenses,
            investments: investments,
            earningsPercentage: earningsPercentage,
            expensesPercentage: expensesPercentage,
            investmentsPercentage: investmentsPercentage,
            balance: balance,
        }
    }
}
