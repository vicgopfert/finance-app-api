import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        const [scheme, accessToken] = authHeader?.split(' ') ?? []

        if (scheme !== 'Bearer' || !accessToken) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )

        req.user = decodedToken

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expired',
            })
        }

        return res.status(401).json({
            message: 'Unauthorized',
        })
    }
}
