import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'

describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transactions - should return 201 when creating a transaction successfully', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.transaction.user_id).toBe(createdUser.id)
        expect(response.body.transaction.type).toBe(transaction.type)
        expect(response.body.transaction.amount).toBe(
            String(transaction.amount),
        )
    })
})
