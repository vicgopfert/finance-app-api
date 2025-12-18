import { badRequest, ok, serverError } from './helpers.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id
            const isIdValid = validator.isUUID(userId)
            if (!isIdValid) {
                return badRequest({ message: 'O ID fornecido é inválido.' })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(userId)
            return ok(user)
        } catch (error) {
            console.error('Erro ao obter usuário por ID:', error)
            return serverError({ message: 'Erro interno do servidor' })
        }
    }
}
