/**
 * Jest setup file
 * Runs before all tests
 */

// Set test environment
process.env.NODE_ENV = 'test'
process.env.AUTH_SECRET = 'test-secret-key-for-jest-tests-only'
process.env.SERVER_PORT = '5001'

// Suppress console logs during tests (optional - uncomment if needed)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// }
