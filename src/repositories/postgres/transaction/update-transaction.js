import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionsParams) {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId,
            },
        })

        if (!transaction) {
            return null
        }

        const updatedTransaction = await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: updateTransactionsParams,
        })

        return updatedTransaction
    }
}
