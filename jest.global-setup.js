/*
Quando usar o docker para rodar os testes, descomente o código abaixo e a linha de globalSetup no jest.config.js

import { execSync } from 'child_process'

export default async function () {
    execSync('docker compose up -d --wait postgres-test')
    execSync('npx prisma db push')
}
*/
