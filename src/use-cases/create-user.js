import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user'

export class CreateUserUseCase {
    async execute(createUserParams) {
        // TO DO: verificar se o email já está em uso

        // gerar ID único para o usuário
        const userId = uuidv4()
        // criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
        // inserir o usuário no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // chamar o repositório para salvar o usuário
        const postgresCreateUserRepository = new PostgresCreateUserRepository()
        const createdUser = await postgresCreateUserRepository.execute(user)
        return createdUser
    }
}
