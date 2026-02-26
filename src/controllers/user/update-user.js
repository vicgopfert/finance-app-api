import { EmailAlreadyInUseError } from '../../errors/user.js'
import { updateUserSchema } from '../../schemas/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

import { z } from 'zod'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse(userId)
            }

            const params = httpRequest.body

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            if (!updatedUser) {
                return userNotFoundResponse()
            }

            return ok({
                message: 'User updated successfully',
                user: updatedUser,
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                const unrecognizedKeysError = error.issues.find(
                    (issue) => issue.code === 'unrecognized_keys',
                )

                if (unrecognizedKeysError) {
                    return badRequest({
                        message:
                            'Some provided field is not allowed to be updated',
                    })
                }

                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error('Error validating update user request:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
