import {
    generateCreateTransactionController,
    generateUpdateTransactionController,
    generateDeleteTransactionController,
} from './transaction'
import {
    CreateTransactionController,
    UpdateTransactionController,
    DeleteTransactionController,
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
})
