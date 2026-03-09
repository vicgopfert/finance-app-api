import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const getUserByEmailRepository = this.getUserByEmailRepository

            const userWithProvidedEmail =
                await getUserByEmailRepository.execute(updateUserParams.email)

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        if (updateUserParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
            )
            user.password = hashedPassword
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        )

        if (!updatedUser) {
            throw new UserNotFoundError(userId)
        }

        return updatedUser
    }
}
