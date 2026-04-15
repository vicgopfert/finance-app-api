import {
    generateCreateUserController,
    generateGetUserByIdController,
    generateGetUserBalanceController,
    generateUpdateUserController,
    generateDeleteUserController,
} from './user'
import {
    CreateUserController,
    GetUserByIdController,
    GetUserBalanceController,
    UpdateUserController,
    DeleteUserController,
} from '../../controllers'

describe('User Controller Factories', () => {
    it('should return a valid CreateUserController instance', () => {
        expect(generateCreateUserController()).toBeInstanceOf(
            CreateUserController,
        )
    })

    it('should return a valid GetUserByIdController instance', () => {
        expect(generateGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid GetUserBalanceController instance', () => {
        expect(generateGetUserBalanceController()).toBeInstanceOf(
            GetUserBalanceController,
        )
    })

    it('should return a valid UpdateUserController instance', () => {
        expect(generateUpdateUserController()).toBeInstanceOf(
            UpdateUserController,
        )
    })

    it('should return a valid DeleteUserController instance', () => {
        expect(generateDeleteUserController()).toBeInstanceOf(
            DeleteUserController,
        )
    })
})
