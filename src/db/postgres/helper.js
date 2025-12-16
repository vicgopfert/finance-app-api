import pg from 'pg'

const { Pool } = pg

// cria o pool de conexões
export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // configs
    max: 10, // máximo de conexões no pool
    idleTimeoutMillis: 30000, // tempo ocioso antes de fechar conexão
    connectionTimeoutMillis: 2000, // timeout de conexão
})

export const PostgresHelper = {
    query: async (text, params) => {
        const client = await pool.connect()
        const results = await client.query(text, params)
        await client.release()
        return results.rows
    },
}
