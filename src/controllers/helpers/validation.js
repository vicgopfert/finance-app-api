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

export const checkIfIsString = (value) => typeof value === 'string'

export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmptyString =
            checkIfIsString(params[field]) &&
            validator.isEmpty(params[field], {
                ignore_whitespace: true,
            })

        if (fieldIsMissing || fieldIsEmptyString) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }

    return { missingField: undefined, ok: true }
}
