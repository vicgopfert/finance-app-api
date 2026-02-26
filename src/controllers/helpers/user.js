import { badRequest, notFound } from './http.js'

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at least 6 characters long.',
    })

export const invalidEmailResponse = (email) =>
    badRequest({
        message: `The provided email ${email} is already in use.`,
    })

export const userNotFoundResponse = () =>
    notFound({
        message: `User not found.`,
    })
