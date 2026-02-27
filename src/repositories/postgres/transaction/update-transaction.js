import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionsParams) {
        const updatedTransaction = await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: updateTransactionsParams,
        })

        return updatedTransaction
    }
}
