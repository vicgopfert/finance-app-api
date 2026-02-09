import { badRequest, ok, serverError } from '../controllers/helpers.js'
import validator from 'validator'
import { UpdateUserUseCase } from '../use-cases/update-user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({ message: 'The provided ID is invalid.' })
            }

            const updateUserParams = httpRequest.body

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed to be updated',
                })
            }

            if (updateUserParams.password) {
                const passwordIsValid = validator.isLength(
                    updateUserParams.password,
                    {
                        min: 6,
                    },
                )

                if (!passwordIsValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters long.',
                    })
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)

                if (!emailIsValid) {
                    return badRequest({
                        message: 'The provided email is invalid.',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()
            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
            return ok(updatedUser)
        } catch (error) {
            console.error('Error validating update user request:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
