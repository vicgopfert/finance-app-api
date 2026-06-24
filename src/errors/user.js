export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`Email is already in use.`)
        this.name = 'EmailAlreadyInUseError'
        this.email = email
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User not found.`)
        this.name = 'UserNotFoundError'
        this.userId = userId
    }
}

export class InvalidPasswordError extends Error {
    constructor() {
        super(`Invalid password.`)
        this.name = 'InvalidPasswordError'
    }
}
