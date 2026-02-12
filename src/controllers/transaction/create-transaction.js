import validator from 'validator'
import {
    badRequest,
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    serverError,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            for (const field of requiredFields) {
                if (
                    !params[field] ||
                    params[field].toString().trim().length === 0
                ) {
                    return badRequest({
                        message: `Field ${field} is required.`,
                    })
                }
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse(params.user_id)
            }

            if (params.amount <= 0) {
                return badRequest({ message: 'Amount must be greater than 0.' })
            }

            const hasMoreThanTwoDecimals = !Number.isInteger(
                params.amount * 100,
            )

            if (hasMoreThanTwoDecimals) {
                return badRequest({
                    message: 'Amount must have at most 2 decimal places.',
                })
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toFixed(2),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'Amount must be a valid currency value.',
                })
            }

            const type = params.type.toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message:
                        'Type must be one of EARNING, EXPENSE, or INVESTMENT.',
                })
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
