/**
 * Jest global teardown file
 * Runs after all tests complete
 * Ensures all database connections are properly closed
 */

module.exports = async () => {
  try {
    const { sequelize } = require('../models/index')

    // Close all Sequelize connections if they exist and are connected
    if (sequelize && sequelize.connectionManager) {
      await sequelize.close()
    }
  } catch (error) {
    // Ignore errors if connection is already closed
    if (error.message && !error.message.includes('already been closed')) {
      console.error('Error closing database connections:', error.message)
    }
  }
}
