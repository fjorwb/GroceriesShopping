'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productsmock', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barcode: {
        type: Sequelize.STRING
      },
      idext: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      presentation: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },

      market_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productsmock')
  }
}
