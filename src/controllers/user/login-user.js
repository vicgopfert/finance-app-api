import { z } from 'zod'

import { loginUserSchema } from '../../schemas/index.js'
import { ok, serverError, badRequest, unauthorized } from '../helpers/index.js'
import { UserNotFoundError, InvalidPasswordError } from '../../errors/user.js'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await loginUserSchema.parseAsync(params)

            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )

            return ok(user)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (
                error instanceof UserNotFoundError ||
                error instanceof InvalidPasswordError
            ) {
                return unauthorized({
                    message: 'Invalid credentials.',
                })
            }
            console.error('Error logging in user:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
