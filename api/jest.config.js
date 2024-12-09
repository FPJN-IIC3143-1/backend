module.exports = {
    preset: '@shelf/jest-mongodb',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!jest.config.js'
    ],
}; 
