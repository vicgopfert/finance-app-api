import { Router } from 'express'
import {
    generateCreateTransactionController,
    generateDeleteTransactionController,
    generateGetTransactionsByUserIdController,
    generateUpdateTransactionController,
} from '../factories/index.js'
import { auth } from '../middlewares/auth.js'

export const transactionsRouter = Router()

transactionsRouter.get('/me', auth, async (req, res) => {
    const getTransactionsByUserIdController =
        generateGetTransactionsByUserIdController()
    const { statusCode, body } =
        await getTransactionsByUserIdController.execute({
            ...req,
            query: {
                ...req.query,
                from: req.query.from,
                to: req.query.to,
                userId: req.user.userId,
            },
        })
    res.status(statusCode).json(body)
})

transactionsRouter.post('/me', auth, async (req, res) => {
    const createTransactionController = generateCreateTransactionController()
    const { statusCode, body } = await createTransactionController.execute({
        ...req,
        body: {
            ...req.body,
            user_id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

transactionsRouter.patch('/me/:id', auth, async (req, res) => {
    const updateTransactionController = generateUpdateTransactionController()
    const { statusCode, body } = await updateTransactionController.execute({
        ...req,
        params: {
            ...req.params,
            user_id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

transactionsRouter.delete('/me/:id', auth, async (req, res) => {
    const deleteTransactionController = generateDeleteTransactionController()
    const { statusCode, body } = await deleteTransactionController.execute({
        params: {
            id: req.params.id,
            user_id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})
