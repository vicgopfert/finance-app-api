import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
    }

    async execute(createUserParams) {
        const getUserByEmailRepository = this.getUserByEmailRepository

        const userWithProvidedEmail = await getUserByEmailRepository.execute(
            createUserParams.email,
        )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // gerar ID único para o usuário
        const userId = await this.idGeneratorAdapter.execute()
        // criptografar a senha
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )
        // inserir o usuário no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // chamar o repositório para salvar o usuário
        const createUserRepository = this.createUserRepository
        const createdUser = await createUserRepository.execute(user)
        return createdUser
    }
}
