import { RefreshTokenController } from './refresh-token.js'
import { UnauthorizedError } from '../../errors/user.js'

describe('Refresh Token Controller', () => {
    class RefreshTokenUseCaseStub {
        execute() {
            return {
                accessToken: 'valid_access_token',
                refreshToken: 'valid_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub()
        const sut = new RefreshTokenController(refreshTokenUseCase)
        return { sut, refreshTokenUseCase }
    }

    it('should return 200 and new tokens when refresh token is valid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 'valid_refresh_token',
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 if refresh token is invalid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 2,
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(400)
    })

    it('should return 401 if use case throws UnauthorizedError', async () => {
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new UnauthorizedError()
            })
        const httpRequest = {
            body: {
                refreshToken: 'invalid_refresh_token',
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(401)
    })

    it('should return 500 if use case throws an unexpected error', async () => {
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new Error('Unexpected error')
            })
        const httpRequest = {
            body: {
                refreshToken: 'valid_refresh_token',
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(500)
    })
})
