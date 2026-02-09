import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, serverError } from './helpers.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import validator from 'validator'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            // validar a requisição (campos obrigatórios, tamanho da senha e email)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `O campo ${field} é obrigatório.`,
                    })
                }
            }

            const passwordIsValid = validator.isLength(params.password, {
                min: 6,
            })

            if (!passwordIsValid) {
                return badRequest({
                    message: 'Password must be at least 6 characters long.',
                })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest({ message: 'The provided email is invalid.' })
            }

            // chamar o use case
            const createUserUseCase = new CreateUserUseCase()
            const createdUser = await createUserUseCase.execute(params)

            // retornar a resposta para o usuário (status code)
            return created({
                message: 'User created successfully',
                user: createdUser,
            })
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error('Error creating user:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
