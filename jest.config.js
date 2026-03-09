/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
    testMatch: ['**/src/**/*.test.js'],
    verbose: true,
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [],
}
