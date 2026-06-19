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

    it('POST /api/users - should return 400 when password is invalid', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                password: '123',
            })

        expect(response.statusCode).toBe(400)
    })

    it('POST /api/users/login - should return 200 and tokens when user credentials are valid', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/users/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST /api/users/login - should return 401 when password is invalid', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/users/login').send({
            email: createdUser.email,
            password: 'invalid-password',
        })

        expect(response.statusCode).toBe(401)
    })

    it('POST /api/users/login - should return 401 when user is not found', async () => {
        const response = await request(app).post('/api/users/login').send({
            email: 'non-existent@example.com',
            password: 'any-password',
        })

        expect(response.statusCode).toBe(401)
    })

    it('GET /api/users - should return 200 and user data successfully', async () => {
        const {
            body: { user: createdUser, tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(createdUser)
    })

    it('GET /api/users/balance - should return 200 and correct balance successfully', async () => {
        const {
            body: { user: createdUser, tokens },
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

        const response = await request(app)
            .get(`/api/users/balance`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
            balance: '6000',
        })
    })

    it('PATCH /api/users - should return 200 when user is updated successfully', async () => {
        const {
            body: { tokens },
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
            .patch('/api/users')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send(updatedUserParams)

        expect(response.statusCode).toBe(200)
        expect(response.body.user).toMatchObject({
            first_name: updatedUserParams.first_name,
            last_name: updatedUserParams.last_name,
            email: updatedUserParams.email,
        })
        expect(response.body.user.password).not.toBe(updatedUserParams.password)
    })

    it('DELETE /api/users - should return 200 when user is deleted successfully', async () => {
        const {
            body: { user: createdUser, tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .delete('/api/users')
            .set('Authorization', `Bearer ${tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.user).toEqual(createdUser)
    })
})
