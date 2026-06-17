import { Router } from 'express'
import {
    generateCreateUserController,
    generateDeleteUserController,
    generateGetUserBalanceController,
    generateGetUserByIdController,
    generateUpdateUserController,
    generateLoginUserController,
} from '../factories/controllers/user.js'

export const usersRouter = Router()

usersRouter.get('/:id', async (req, res) => {
    const getUserByIdController = generateGetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute(req)
    res.status(statusCode).json(body)
})

usersRouter.get('/:id/balance', async (req, res) => {
    const getUserBalanceController = generateGetUserBalanceController()
    const { statusCode, body } = await getUserBalanceController.execute(req)
    res.status(statusCode).json(body)
})

usersRouter.post('/', async (req, res) => {
    const createUserController = generateCreateUserController()
    const { statusCode, body } = await createUserController.execute(req)
    res.status(statusCode).json(body)
})

usersRouter.patch('/:id', async (req, res) => {
    const updateUserController = generateUpdateUserController()
    const { statusCode, body } = await updateUserController.execute(req)
    res.status(statusCode).json(body)
})

usersRouter.delete('/:id', async (req, res) => {
    const deleteUserController = generateDeleteUserController()
    const { statusCode, body } = await deleteUserController.execute(req)
    res.status(statusCode).json(body)
})

usersRouter.post('/login', async (req, res) => {
    const loginUserController = generateLoginUserController()
    const { statusCode, body } = await loginUserController.execute(req)
    res.status(statusCode).json(body)
})
