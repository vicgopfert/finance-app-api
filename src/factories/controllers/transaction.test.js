import {
    generateCreateTransactionController,
    generateUpdateTransactionController,
    generateDeleteTransactionController,
    generateGetTransactionsByUserIdController,
} from './transaction'
import {
    CreateTransactionController,
    UpdateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
} from '../../controllers'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(generateCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', () => {
        expect(generateUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })

    it('should return a valid DeleteTransactionController instance', () => {
        expect(generateDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })

    it('should return a valid GetTransactionsByUserIdController instance', () => {
        expect(generateGetTransactionsByUserIdController()).toBeInstanceOf(
            GetTransactionsByUserIdController,
        )
    })
})
