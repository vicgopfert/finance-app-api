import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
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
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
            user.password = hashedPassword
        }

        const updateUserRepository = this.updateUserRepository
        const updatedUser = await updateUserRepository.execute(userId, user)

        return updatedUser
    }
}
