import validator from 'validator'
import { badRequest } from './http.js'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters long.',
    })
}

export const invalidEmailResponse = (email) => {
    return badRequest({
        message: `The provided email ${email} is already in use.`,
    })
}

export const invalidIdResponse = (id) => {
    return badRequest({
        message: `The provided ID ${id} is invalid.`,
    })
}

export const checkIfPasswordIsValid = (password) =>
    password && password.trim().length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)
