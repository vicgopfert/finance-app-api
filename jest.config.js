/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: false,
    coverageDirectory: 'coverage',
    testMatch: ['**/src/**/*.test.js'],
    verbose: true,
}
