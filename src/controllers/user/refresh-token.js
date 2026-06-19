import { z } from 'zod'

import { UnauthorizedError } from '../../errors/user.js'
import { refreshTokenSchema } from '../../schemas/user.js'
import { ok, serverError, unauthorized, badRequest } from '../helpers/index.js'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await refreshTokenSchema.parseAsync(params)

            const response = this.refreshTokenUseCase.execute(
                params.refreshToken,
            )

            return ok(response)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof UnauthorizedError) {
                return unauthorized(error.message)
            }

            console.error('Error refreshing token:', error)
            return serverError({
                message: 'Internal server error',
            })
        }
    }
}
