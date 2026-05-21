import { Router } from 'express'
import {
    generateCreateTransactionController,
    generateDeleteTransactionController,
    generateGetTransactionsByUserIdController,
    generateUpdateTransactionController,
} from '../factories/controllers/transaction.js'

export const transactionsRouter = Router()

transactionsRouter.get('/', async (req, res) => {
    const getTransactionsByUserIdController =
        generateGetTransactionsByUserIdController()
    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(req)
    res.status(statusCode).json(body)
})

transactionsRouter.post('/', async (req, res) => {
    const createTransactionController = generateCreateTransactionController()
    const { statusCode, body } = await createTransactionController.execute(req)
    res.status(statusCode).json(body)
})

transactionsRouter.patch('/:id', async (req, res) => {
    const updateTransactionController = generateUpdateTransactionController()
    const { statusCode, body } = await updateTransactionController.execute(req)
    res.status(statusCode).json(body)
})

transactionsRouter.delete('/:id', async (req, res) => {
    const deleteTransactionController = generateDeleteTransactionController()
    const { statusCode, body } = await deleteTransactionController.execute(req)
    res.status(statusCode).json(body)
})
