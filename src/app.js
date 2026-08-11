import express from 'express'
import cors from 'cors'
import { usersRouter, transactionsRouter, authRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerDocument = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '..', 'docs', 'swagger.json'),
        'utf-8',
    ),
)

const app = express()

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(
    cors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        credentials: true,
    }),
)

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/auth', authRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export { app }
