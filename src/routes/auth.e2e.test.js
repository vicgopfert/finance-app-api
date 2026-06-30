import request from 'supertest'
import { app } from '../app'
import { user } from '../tests/fixtures/user'

describe('Auth Routes E2E Tests', () => {
    it('POST /api/auth/login - should return 200 and tokens when user credentials are valid', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/auth/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST /api/auth/login - should return 401 when password is invalid', async () => {
        const {
            body: { user: createdUser },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/auth/login').send({
            email: createdUser.email,
            password: 'invalid-password',
        })

        expect(response.statusCode).toBe(401)
    })

    it('POST /api/auth/login - should return 401 when user is not found', async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: 'non-existent@example.com',
            password: 'any-password',
        })

        expect(response.statusCode).toBe(401)
    })
    it('POST /api/auth/refresh-token - should return 200 and new tokens when refresh token is valid', async () => {
        const {
            body: { tokens },
        } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/auth/refresh-token')
            .send({
                refreshToken: tokens.refreshToken,
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST /api/auth/refresh-token - should return 401 when refresh token is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/refresh-token')
            .send({
                refreshToken: 'invalid-refresh-token',
            })

        expect(response.statusCode).toBe(401)
    })
})
