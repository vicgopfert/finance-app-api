import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionsParams) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateTransactionsParams).forEach((key) => {
            updateFields.push(`${key} = $${updateFields.length + 1}`)
            updateValues.push(updateTransactionsParams[key])
        })

        updateValues.push(transactionId)

        const updateQuery = `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = $${updateValues.length} RETURNING *;`

        const updatedTransaction = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updatedTransaction[0]
    }
}
