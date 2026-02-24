import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfAmountIsValid = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return false
    }

    return validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
    })
}

export const checkIfTypeIsValid = (type) => {
    return ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)
}

export const invalidAmountResponse = (amount) => {
    return badRequest({
        message: `The provided amount ${amount} is invalid. Amount must be a valid currency value.`,
    })
}

export const invalidTypeResponse = (type) => {
    return badRequest({
        message: `The provided type ${type} is invalid. Type must be one of EARNING, EXPENSE, or INVESTMENT.`,
    })
}

export const checkIfHasMoreThanTwoDecimals = (amount) =>
    !Number.isInteger(amount * 100)

export const invalidAmountDecimalsResponse = (amount) => {
    return badRequest({
        message: `The provided amount ${amount} is invalid. Amount must have at most 2 decimal places.`,
    })
}
