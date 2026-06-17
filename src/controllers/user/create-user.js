import { z } from 'zod'

import { EmailAlreadyInUseError } from '../../errors/user.js'
import { createUserSchema } from '../../schemas/index.js'
import { badRequest, created, serverError } from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createUserSchema.parseAsync(params)

            const createdUser = await this.createUserUseCase.execute(params)

            return created({
                message: 'User created successfully',
                user: createdUser.user,
                tokens: createdUser.tokens,
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error('Error creating user:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
