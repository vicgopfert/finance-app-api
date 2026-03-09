import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = (id) =>
    badRequest({
        message: `The provided ID ${id} is invalid.`,
    })

export const requiredFieldIsMissingResponse = (field) =>
    badRequest({
        message: `Field ${field} is required.`,
    })
