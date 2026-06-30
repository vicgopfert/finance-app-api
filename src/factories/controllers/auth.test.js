import {
    LoginUserController,
    RefreshTokenController,
} from '../../controllers/index.js'
import {
    generateLoginUserController,
    generateRefreshTokenController,
} from './auth.js'

describe('Auth Controller Factories', () => {
    it('should return a valid LoginUserController instance', () => {
        expect(generateLoginUserController()).toBeInstanceOf(
            LoginUserController,
        )
    })

    it('should return a valid RefreshTokenController instance', () => {
        expect(generateRefreshTokenController()).toBeInstanceOf(
            RefreshTokenController,
        )
    })
})
