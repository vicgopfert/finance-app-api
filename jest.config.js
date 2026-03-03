/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: false,
    coverageDirectory: 'coverage',
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
}
