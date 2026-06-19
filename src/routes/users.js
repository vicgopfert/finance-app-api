import { Router } from 'express'
import {
    generateCreateUserController,
    generateDeleteUserController,
    generateGetUserBalanceController,
    generateGetUserByIdController,
    generateUpdateUserController,
    generateLoginUserController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'

export const usersRouter = Router()

usersRouter.get('/', auth, async (req, res) => {
    const getUserByIdController = generateGetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

usersRouter.get('/balance', auth, async (req, res) => {
    const getUserBalanceController = generateGetUserBalanceController()
    const { statusCode, body } = await getUserBalanceController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

usersRouter.post('/', async (req, res) => {
    const createUserController = generateCreateUserController()
    const { statusCode, body } = await createUserController.execute(req)
    res.status(statusCode).json(body)
})

usersRouter.patch('/', auth, async (req, res) => {
    const updateUserController = generateUpdateUserController()
    const { statusCode, body } = await updateUserController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

usersRouter.delete('/', auth, async (req, res) => {
    const deleteUserController = generateDeleteUserController()
    const { statusCode, body } = await deleteUserController.execute({
        ...req,
        params: {
            id: req.user.userId,
        },
    })
    res.status(statusCode).json(body)
})

usersRouter.post('/login', async (req, res) => {
    const loginUserController = generateLoginUserController()
    const { statusCode, body } = await loginUserController.execute(req)
    res.status(statusCode).json(body)
})
