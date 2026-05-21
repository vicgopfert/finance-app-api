import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) {
            return null
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateUserParams,
        })

        return updatedUser
    }
}
