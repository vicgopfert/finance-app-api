const express = require('express')
const { usersRouter, transactionsRouter } = require('./routes')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs', 'swagger.json'), 'utf-8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

module.exports = { app }
