import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, serverError } from './helpers.js'
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
                    message: 'A senha deve ter no mínimo 6 caracteres.',
                })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest({ message: 'O email fornecido é inválido.' })
            }

            // chamar o use case
            const createUserUseCase = new CreateUserUseCase()
            const createdUser = await createUserUseCase.execute(params)

            // retornar a resposta para o usuário (status code)
            return created({
                message: 'Usuário criado com sucesso',
                user: createdUser,
            })
        } catch (error) {
            console.error('Erro ao criar usuário:', error)
            return serverError({ message: 'Erro interno do servidor' })
        }
    }
}
