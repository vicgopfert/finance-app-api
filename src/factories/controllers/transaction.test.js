import { generateCreateTransactionController } from './transaction'
import { CreateTransactionController } from '../../controllers'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(generateCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
