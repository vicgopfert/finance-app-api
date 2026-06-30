import { Router } from 'express'
import {
    generateCreateUserController,
    generateDeleteUserController,
    generateGetUserBalanceController,
    generateGetUserByIdController,
    generateUpdateUserController,
} from '../factories/index.js'
import { auth } from '../middlewares/auth.js'

export const usersRouter = Router()

usersRouter.get('/me', auth, async (req, res) => {
    const getUserByIdController = generateGetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

usersRouter.get('/me/balance', auth, async (req, res) => {
    const getUserBalanceController = generateGetUserBalanceController()
    const { statusCode, body } = await getUserBalanceController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
        query: {
            from: req.query.from,
            to: req.query.to,
        },
    })
    res.status(statusCode).json(body)
})

usersRouter.post('/', async (req, res) => {
    const createUserController = generateCreateUserController()
    const { statusCode, body } = await createUserController.execute(req)
    res.status(statusCode).json(body)
})

usersRouter.patch('/me', auth, async (req, res) => {
    const updateUserController = generateUpdateUserController()
    const { statusCode, body } = await updateUserController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

usersRouter.delete('/me', auth, async (req, res) => {
    const deleteUserController = generateDeleteUserController()
    const { statusCode, body } = await deleteUserController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})
