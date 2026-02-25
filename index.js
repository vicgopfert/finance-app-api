import 'dotenv/config.js'
import express from 'express'
import {
    generateCreateUserController,
    generateDeleteUserController,
    generateGetUserBalanceController,
    generateGetUserByIdController,
    generateUpdateUserController,
} from './src/factories/controllers/user.js'
import {
    generateCreateTransactionController,
    generateDeleteTransactionController,
    generateGetTransactionsByUserIdController,
    generateUpdateTransactionController,
} from './src/factories/controllers/transaction.js'

const app = express()

app.use(express.json())

// User routes
app.get('/api/users/:id', async (req, res) => {
    const getUserByIdController = generateGetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute(req)
    res.status(statusCode).json(body)
})

app.get('/api/users/:id/balance', async (req, res) => {
    const getUserBalanceController = generateGetUserBalanceController()
    const { statusCode, body } = await getUserBalanceController.execute(req)
    res.status(statusCode).json(body)
})

app.post('/api/users', async (req, res) => {
    const createUserController = generateCreateUserController()
    const { statusCode, body } = await createUserController.execute(req)
    res.status(statusCode).json(body)
})

app.patch('/api/users/:id', async (req, res) => {
    const updateUserController = generateUpdateUserController()
    const { statusCode, body } = await updateUserController.execute(req)
    res.status(statusCode).json(body)
})

app.delete('/api/users/:id', async (req, res) => {
    const deleteUserController = generateDeleteUserController()
    const { statusCode, body } = await deleteUserController.execute(req)
    res.status(statusCode).json(body)
})

// Transaction routes
app.get('/api/transactions', async (req, res) => {
    const getTransactionsByUserIdController =
        generateGetTransactionsByUserIdController()
    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(req)
    res.status(statusCode).json(body)
})

app.post('/api/transactions', async (req, res) => {
    const createTransactionController = generateCreateTransactionController()
    const { statusCode, body } = await createTransactionController.execute(req)
    res.status(statusCode).json(body)
})

app.patch('/api/transactions/:id', async (req, res) => {
    const updateTransactionController = generateUpdateTransactionController()
    const { statusCode, body } = await updateTransactionController.execute(req)
    res.status(statusCode).json(body)
})

app.delete('/api/transactions/:id', async (req, res) => {
    const deleteTransactionController = generateDeleteTransactionController()
    const { statusCode, body } = await deleteTransactionController.execute(req)
    res.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})
