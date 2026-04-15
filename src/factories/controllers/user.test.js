import {
    generateCreateUserController,
    generateGetUserByIdController,
    generateUpdateUserController,
} from './user'
import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
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

    it('should return a valid UpdateUserController instance', () => {
        expect(generateUpdateUserController()).toBeInstanceOf(
            UpdateUserController,
        )
    })
})
