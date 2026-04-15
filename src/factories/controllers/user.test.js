import {
    generateCreateUserController,
    generateGetUserByIdController,
} from './user'
import { CreateUserController, GetUserByIdController } from '../../controllers'

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
})
