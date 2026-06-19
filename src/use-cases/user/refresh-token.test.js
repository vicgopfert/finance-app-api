import { UnauthorizedError } from '../../errors/user.js'
import { RefreshTokenUseCase } from './refresh-token.js'

describe('Refresh Token Use Case', () => {
    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    class TokenVerifierAdapterStub {
        execute() {
            return true
        }
    }

    const makeSut = () => {
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )
        return { sut, tokensGeneratorAdapter, tokenVerifierAdapter }
    }

    it('should return new tokens', async () => {
        const { sut } = makeSut()
        const refreshToken = 'any_refresh_token'

        const result = await sut.execute(refreshToken)

        expect(result).toEqual({
            tokens: {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            },
        })
    })

    it('should throw UnauthorizedError if TokenVerifierAdapter returns falsy decoded token', () => {
        const { sut, tokenVerifierAdapter } = makeSut()

        import.meta.jest
            .spyOn(tokenVerifierAdapter, 'execute')
            .mockReturnValue(null)

        expect(() => sut.execute('any_refresh_token')).toThrow(
            UnauthorizedError,
        )
    })

    it('should throw if TokenVerifierAdapter throws', () => {
        const { sut, tokenVerifierAdapter } = makeSut()

        import.meta.jest
            .spyOn(tokenVerifierAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        expect(() => sut.execute('any_refresh_token')).toThrow(
            UnauthorizedError,
        )
    })
})
