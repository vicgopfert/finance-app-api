import {
    generateCreateTransactionController,
    generateUpdateTransactionController,
} from './transaction'
import {
    CreateTransactionController,
    UpdateTransactionController,
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
})
