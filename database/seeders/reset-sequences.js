'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Reset sequences for all tables with auto-increment IDs
    const tables = [
      'users',
      'recipes',
      'menus',
      'shoppinglists',
      'ingredients',
      'markets',
      'productcategories',
      'products',
      'productsmock'
    ]

    for (const table of tables) {
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${table};`
      )
    }

    console.log('✓ All sequences have been reset to continue from the highest existing ID')
  },

  async down(queryInterface, Sequelize) {
    // No rollback needed for sequence resets
  }
}
