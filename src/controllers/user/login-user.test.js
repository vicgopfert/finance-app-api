import { LoginUserController } from './login-user'
import { user } from '../../tests/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js'

describe('Login User Controller', () => {
    const makeSut = () => {
        class LoginUserUseCaseStub {
            async execute() {
                return {
                    ...user,
                    tokens: {
                        accessToken: 'any_access_token',
                        refreshToken: 'any_refresh_token',
                    },
                }
            }
        }

        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)
        return { sut, loginUserUseCase }
    }

    const httpRequest = {
        body: {
            email: 'test@example.com',
            password: '12345678',
        },
    }

    it('should return 200 and user and tokens on successful login', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            ...user,
            tokens: {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            },
        })
    })

    it('should return 401 if password are invalid', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new InvalidPasswordError())

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(401)
        expect(response.body).toEqual({
            message: 'Invalid credentials.',
        })
    })

    it('should return 401 if user is not found', async () => {
        const { sut, loginUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(401)
        expect(response.body).toEqual({
            message: 'Invalid credentials.',
        })
    })
})
