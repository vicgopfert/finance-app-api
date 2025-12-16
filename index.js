import 'dotenv/config.js'
import express from 'express'
import { pool } from './src/db/postgres/helper.js'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})

// teste de conexão
const main = async () => {
    try {
        const result = await pool.query('SELECT NOW()')
        console.log('🚀 Servidor iniciado com sucesso')
        console.log('📅 Data/Hora do banco:', result.rows[0].now)
    } catch (error) {
        console.error('❌ Erro ao conectar com o banco:', error)
        process.exit(1)
    }
}

main()
