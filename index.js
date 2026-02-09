import 'dotenv/config.js'
import express from 'express'
import {
    CreateUserController,
    UpdateUserController,
    GetUserByIdController,
    DeleteUserController,
} from './src/controllers/index.js'

const app = express()

app.use(express.json())

app.get('/api/users/:id', async (req, res) => {
    const getUserByIdController = new GetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute(req)
    res.status(statusCode).json(body)
})

app.patch('/api/users/:id', async (req, res) => {
    const updateUserController = new UpdateUserController()
    const { statusCode, body } = await updateUserController.execute(req)
    res.status(statusCode).json(body)
})

app.post('/api/users', async (req, res) => {
    const createUserController = new CreateUserController()
    const { statusCode, body } = await createUserController.execute(req)
    res.status(statusCode).json(body)
})

app.delete('/api/users/:id', async (req, res) => {
    const deletedUserController = new DeleteUserController()
    const { statusCode, body } = await deletedUserController.execute(req)
    res.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})
