import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'
import { TransactionType } from '@prisma/client'

describe('Transaction Routes E2E Tests', () => {
    const from = '2026-01-01'
    const to = '2026-01-31'

    it('POST /api/transactions/me - should return 201 when creating a transaction successfully', async () => {
        const {
            body: { user: createdUser, tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.transaction.user_id).toBe(createdUser.id)
        expect(response.body.transaction.type).toBe(transaction.type)
        expect(response.body.transaction.amount).toBe(
            String(transaction.amount),
        )
    })

    it('POST /api/transactions/me - should return 401 when token is not provided', async () => {
        const response = await request(app)
            .post('/api/transactions/me')
            .send({
                ...transaction,
                id: undefined,
            })

        expect(response.status).toBe(401)
    })

    it('GET /api/transactions/me - should return 200 when fetching transactions successfully', async () => {
        const {
            body: { user: createdUser, tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const {
            body: { transaction: createdTransaction },
        } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({
                ...transaction,
                date: new Date(from),
                user_id: createdUser.id,
                id: undefined,
            })

        const response = await request(app)
            .get(`/api/transactions/me?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBe(1)
        expect(response.body[0]).toEqual(createdTransaction)
    })

    it('GET /api/transactions/me - should return 401 when token is not provided', async () => {
        const response = await request(app).get('/api/transactions/me')

        expect(response.status).toBe(401)
    })

    it('PATCH /api/transactions/me/:id - should return 200 when updating a transaction successfully', async () => {
        const {
            body: { tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const {
            body: { transaction: createdTransaction },
        } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
            })

        const response = await request(app)
            .patch(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({
                amount: 200,
                type: TransactionType.INVESTMENT,
            })

        expect(response.status).toBe(200)
        expect(response.body.transaction.amount).toBe('200')
        expect(response.body.transaction.type).toBe(TransactionType.INVESTMENT)
    })

    it('PATCH /api/transactions/me/:id - should return 404 when updating a non-existing transaction', async () => {
        const {
            body: { tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .patch(`/api/transactions/me/${transaction.id}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({
                amount: 200,
                type: TransactionType.INVESTMENT,
            })

        expect(response.status).toBe(404)
    })

    it('PATCH /api/transactions/me/:id - should return 403 when updating another user transaction', async () => {
        const {
            body: { tokens: ownerTokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const {
            body: { tokens: anotherUserTokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: 'another-user@example.com',
            })

        const {
            body: { transaction: createdTransaction },
        } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${ownerTokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
            })

        const response = await request(app)
            .patch(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${anotherUserTokens.accessToken}`)
            .send({
                amount: 200,
            })

        expect(response.status).toBe(403)
    })

    it('DELETE /api/transactions/me/:id - should return 200 when deleting a transaction successfully', async () => {
        const {
            body: { tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const {
            body: { transaction: createdTransaction },
        } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({
                ...transaction,
                id: undefined,
            })

        const response = await request(app)
            .delete(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.transaction.id).toBe(createdTransaction.id)
    })

    it('DELETE /api/transactions/me/:id - should return 404 when deleting a non-existing transaction', async () => {
        const {
            body: { tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .delete(`/api/transactions/me/${transaction.id}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)

        expect(response.status).toBe(404)
    })
})
