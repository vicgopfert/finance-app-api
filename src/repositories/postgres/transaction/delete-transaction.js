import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId,
            },
        })

        if (!transaction) {
            return null
        }

        await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        })

        return transaction
    }
}
