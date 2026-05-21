import request from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/user.js'
import { faker } from '@faker-js/faker'

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

    it('GET /api/users/:id - should return 200 when user is found', async () => {
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
})
