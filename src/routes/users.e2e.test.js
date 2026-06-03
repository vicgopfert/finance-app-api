import request from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/user.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('User Routes E2E Tests', () => {
    it('POST /api/users - should return 201 when user is created successfully', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        expect(response.statusCode).toBe(201)
    })

    it('POST /api/users - should return 400 when the provided e-mail is already in use', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                email: createdUser.email,
            })

        expect(response.statusCode).toBe(400)
    })

    it('POST /api/users - should return 400 when required fields are missing', async () => {
        const response = await request(app).post('/api/users').send({
            first_name: faker.person.firstName(),
        })

        expect(response.statusCode).toBe(400)
    })

    it('POST /api/users - should return 400 when e-mail is invalid', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: 'invalid-email',
            })

        expect(response.statusCode).toBe(400)
    })

    it('POST /api/users - should return 400 when password is too weak', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                password: '123',
            })

        expect(response.statusCode).toBe(400)
    })

    it('GET /api/users/:id - should return 200 and user data successfully', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).get(`/api/users/${createdUser.id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(createdUser)
    })

    it('GET /api/users/:id/balance - should return 200 and balance 0 when user has no transactions', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).get(
            `/api/users/${createdUser.id}/balance`,
        )

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            earnings: '0',
            expenses: '0',
            investments: '0',
            balance: '0',
        })
    })

    it('GET /api/users/:id/balance - should return 200 and correct balance successfully', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        await request(app).post('/api/transactions').send({
            user_id: createdUser.id,
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: TransactionType.EARNING,
            amount: 10000,
        })

        await request(app).post('/api/transactions').send({
            user_id: createdUser.id,
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: TransactionType.EXPENSE,
            amount: 2000,
        })

        await request(app).post('/api/transactions').send({
            user_id: createdUser.id,
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: TransactionType.INVESTMENT,
            amount: 2000,
        })

        const response = await request(app).get(
            `/api/users/${createdUser.id}/balance`,
        )

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
            balance: '6000',
        })
    })

    it('GET /api/users/:id - should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}`,
        )

        expect(response.statusCode).toBe(404)
    })

    it('GET /api/users/:id/balance - should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}/balance`,
        )

        expect(response.statusCode).toBe(404)
    })

    it('PATCH /api/users/:id - should return 200 when user is updated successfully', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const updatedUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const response = await request(app)
            .patch(`/api/users/${createdUser.id}`)
            .send(updatedUserParams)

        expect(response.statusCode).toBe(200)
        expect(response.body.user).toMatchObject({
            first_name: updatedUserParams.first_name,
            last_name: updatedUserParams.last_name,
            email: updatedUserParams.email,
        })
        expect(response.body.user.password).not.toBe(updatedUserParams.password)
    })

    it('PATCH /api/users/:id - should return 404 when user is not found', async () => {
        const response = await request(app)
            .patch(`/api/users/${faker.string.uuid()}`)
            .send({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            })

        expect(response.statusCode).toBe(404)
    })

    it('DELETE /api/users/:id - should return 200 when user is deleted successfully', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).delete(
            `/api/users/${createdUser.id}`,
        )

        expect(response.statusCode).toBe(200)
        expect(response.body.user).toEqual(createdUser)
    })

    it('DELETE /api/users/:id - should return 404 when user is not found', async () => {
        const response = await request(app).delete(
            `/api/users/${faker.string.uuid()}`,
        )

        expect(response.statusCode).toBe(404)
    })
})
