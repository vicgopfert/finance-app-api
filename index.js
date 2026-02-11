import 'dotenv/config.js'
import express from 'express'
import {
    generateCreateUserController,
    generateDeleteUserController,
    generateGetUserByIdController,
    generateUpdateUserController,
} from './src/factories/controllers/user.js'

const app = express()

app.use(express.json())

app.get('/api/users/:id', async (req, res) => {
    const getUserByIdController = generateGetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute(req)
    res.status(statusCode).json(body)
})

app.patch('/api/users/:id', async (req, res) => {
    const updateUserController = generateUpdateUserController()
    const { statusCode, body } = await updateUserController.execute(req)
    res.status(statusCode).json(body)
})

app.post('/api/users', async (req, res) => {
    const createUserController = generateCreateUserController()
    const { statusCode, body } = await createUserController.execute(req)
    res.status(statusCode).json(body)
})

app.delete('/api/users/:id', async (req, res) => {
    const deleteUserController = generateDeleteUserController()
    const { statusCode, body } = await deleteUserController.execute(req)
    res.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})
