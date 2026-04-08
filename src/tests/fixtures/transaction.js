import { faker } from '@faker-js/faker'

export const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount(0.01, 10000, 2)),
}
