import 'dotenv/config'
import fs from 'fs'
import { pool } from '../helper.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
    const client = await pool.connect()
    try {
        const files = fs
            .readdirSync(__dirname)
            .filter((file) => file.endsWith('.sql'))
            .sort()

        for (const file of files) {
            const filePath = path.join(__dirname, file)
            const script = fs.readFileSync(filePath)
            await client.query(script.toString())
            console.log(`Migration for file ${file} executed successfully`)
        }

        console.log('All Migrations were executed successfully')
    } catch (error) {
        console.error('Error executing migrations:', error)
    } finally {
        client.release()
    }
}

execMigrations()
