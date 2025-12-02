# Integration Tests

This directory contains integration tests for the Groceries Shopping API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure you have a test database configured in `config/config.json`:
```json
{
  "test": {
    "username": "postgres",
    "password": null,
    "database": "groceries_shopping_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

3. Create the test database (if it doesn't exist):
```bash
createdb groceries_shopping_test
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

- `tests/setup.js` - Jest configuration and global setup
- `tests/helpers/testHelpers.js` - Utility functions for creating test data
- `tests/integration/` - Integration test files for each endpoint group
  - `auth.test.js` - Authentication endpoints
  - `users.test.js` - User management endpoints
  - `recipes.test.js` - Recipe endpoints
  - `products.test.js` - Product endpoints
  - `shoppinglists.test.js` - Shopping list endpoints

## Test Utilities

The `testHelpers.js` file provides utilities for:
- Creating test users (regular and admin)
- Generating JWT tokens
- Creating test data (recipes, products, markets, etc.)
- Cleaning up test data
- Database synchronization

## Notes

- Tests run in a separate test database to avoid affecting development data
- All test data is cleaned up after each test suite
- Tests use `force: true` for database sync to ensure clean state
- The test environment uses a separate AUTH_SECRET for security
- The `--forceExit` flag is used to ensure Jest exits after tests complete, even if there are open database connections
- You may see a warning about "open handles" - this is expected and harmless when using `--forceExit`

