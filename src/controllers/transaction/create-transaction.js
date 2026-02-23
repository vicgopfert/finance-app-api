import {
    checkIfAmountIsValid,
    checkIfHasMoreThanTwoDecimals,
    checkIfIdIsValid,
    checkIfTypeIsValid,
    created,
    invalidAmountDecimalsResponse,
    invalidAmountResponse,
    invalidIdResponse,
    invalidTypeResponse,
    requiredFieldIsMissingResponse,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse(params.user_id)
            }

            const hasMoreThanTwoDecimals = checkIfHasMoreThanTwoDecimals(
                params.amount,
            )

            if (hasMoreThanTwoDecimals) {
                return invalidAmountDecimalsResponse(params.amount)
            }

            const amountIsValid = checkIfAmountIsValid(params.amount)

            if (!amountIsValid) {
                return invalidAmountResponse(params.amount)
            }

            const type = params.type.toUpperCase()

            const typeIsValid = checkIfTypeIsValid(type)

            if (!typeIsValid) {
                return invalidTypeResponse(params.type)
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created({
                message: 'Transaction created successfully',
                transaction,
            })
        } catch (error) {
            console.error('Error creating transaction:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
