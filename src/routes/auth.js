import { Router } from 'express'
import {
    generateLoginUserController,
    generateRefreshTokenController,
} from '../factories/index.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
    const loginUserController = generateLoginUserController()
    const { statusCode, body } = await loginUserController.execute(req)
    res.status(statusCode).json(body)
})

authRouter.post('/refresh-token', async (req, res) => {
    const refreshTokenController = generateRefreshTokenController()
    const { statusCode, body } = await refreshTokenController.execute(req)
    res.status(statusCode).json(body)
})
