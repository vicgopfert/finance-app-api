import { LoginUserUseCase } from './login-user.js'
import { UserNotFoundError, InvalidPasswordError } from '../../errors/index.js'
import { user } from '../../tests/index.js'

describe('Login User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapter = new PasswordComparatorAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValueOnce(null)

        await expect(sut.execute('any_email', 'any_password')).rejects.toThrow(
            UserNotFoundError,
        )
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapter } = makeSut()

        import.meta.jest
            .spyOn(passwordComparatorAdapter, 'execute')
            .mockReturnValue(false)

        await expect(sut.execute('any_email', 'any_password')).rejects.toThrow(
            InvalidPasswordError,
        )
    })

    it('should return user with tokens if credentials are valid', async () => {
        const { sut } = makeSut()
        const result = await sut.execute('any_email', 'any_password')

        expect(result).toHaveProperty('tokens')
        expect(result.tokens).toHaveProperty('accessToken')
        expect(result.tokens).toHaveProperty('refreshToken')
    })
})
