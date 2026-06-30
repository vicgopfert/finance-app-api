import jwt from 'jsonwebtoken'
import { auth } from './auth.js'

describe('Auth Middleware', () => {
    const makeRes = () => {
        const res = {}
        res.status = import.meta.jest.fn().mockReturnValue(res)
        res.json = import.meta.jest.fn().mockReturnValue(res)
        return res
    }

    const next = import.meta.jest.fn()

    afterEach(() => {
        import.meta.jest.restoreAllMocks()
    })

    it('should call next() and set req.user when token is valid', () => {
        const decodedToken = { userId: 'any_user_id' }
        import.meta.jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken)

        const req = {
            headers: { authorization: 'Bearer valid_token' },
        }
        const res = makeRes()

        auth(req, res, next)

        expect(req.user).toEqual(decodedToken)
        expect(next).toHaveBeenCalled()
    })

    it('should return 401 when authorization header is missing', () => {
        const req = { headers: {} }
        const res = makeRes()

        auth(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 with "Token expired" when token is expired', () => {
        const error = new Error('jwt expired')
        error.name = 'TokenExpiredError'
        import.meta.jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw error
        })

        const req = {
            headers: { authorization: 'Bearer expired_token' },
        }
        const res = makeRes()

        auth(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Token expired' })
        expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 when token is invalid', () => {
        import.meta.jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('invalid signature')
        })

        const req = {
            headers: { authorization: 'Bearer invalid_token' },
        }
        const res = makeRes()

        auth(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })
})
