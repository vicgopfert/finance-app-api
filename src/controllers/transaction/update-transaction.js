import { updateTransactionSchema } from '../../schemas/transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import {
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
} from '../helpers/index.js'

import { z } from 'zod'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.id

            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse(transactionId)
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    params,
                )

            return ok({
                message: 'Transaction updated successfully',
                transaction: updatedTransaction,
            })
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return notFound({
                    message: error.message,
                })
            }
            if (error instanceof z.ZodError) {
                const unrecognizedKeysError = error.issues.find(
                    (issue) => issue.code === 'unrecognized_keys',
                )

                if (unrecognizedKeysError) {
                    return badRequest({
                        message:
                            'Some provided field is not allowed to be updated',
                    })
                }

                return badRequest({
                    message: error.issues[0].message,
                })
            }
            console.error('Error updating transaction:', error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
