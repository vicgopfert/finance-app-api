import { PostgresHelper } from '../../../db/postgres/helper'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        const createdTransaction = await PostgresHelper.query(
            `
            INSERT INTO transactions (id, user_id, date, name, amount, type) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                createTransactionParams.id,
                createTransactionParams.user_id,
                createTransactionParams.date,
                createTransactionParams.name,
                createTransactionParams.amount,
                createTransactionParams.type,
            ],
        )

        return createdTransaction[0]
    }
}
