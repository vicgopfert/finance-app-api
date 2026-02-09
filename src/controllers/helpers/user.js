import validator from 'validator'
import { badRequest, notFound } from './http.js'

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

export const userNotFoundResponse = () =>
    notFound({
        message: `User not found.`,
    })

export const checkIfPasswordIsValid = (password) =>
    password && password.trim().length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
