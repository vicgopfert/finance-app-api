import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authorization header missing or malformed',
            })
        }

        const accessToken = authHeader.split(' ')[1]

        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' })
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
            message: 'Invalid token',
        })
    }
}
