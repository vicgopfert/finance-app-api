import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
    async execute(password) {
        await bcrypt.hash(password.password, 10)
    }
}
