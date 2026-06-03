/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    clearMocks: true,
    verbose: true,
    testMatch: ['**/src/**/*.test.js'],

    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
    transformIgnorePatterns: [],

    // globalSetup: '<rootDir>/jest.global-setup.js', (quando usar o docker para rodar os testes)
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
}
