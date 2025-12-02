'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraints where they're missing

    // Products table foreign keys
    await queryInterface.addConstraint('products', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'products_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })

    await queryInterface.addConstraint('products', {
      fields: ['market_id'],
      type: 'foreign key',
      name: 'products_market_id_fk',
      references: {
        table: 'markets',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })

    // Markets table foreign key
    await queryInterface.addConstraint('markets', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'markets_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })

    // Shopping lists table foreign key
    await queryInterface.addConstraint('shoppinglists', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'shoppinglists_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })

    // Menus table - ensure recipe_id has foreign key if it references recipes
    // Note: This assumes recipe_id references recipes table
    // If it doesn't, remove this constraint
    await queryInterface.addConstraint('menus', {
      fields: ['recipe_id'],
      type: 'foreign key',
      name: 'menus_recipe_id_fk',
      references: {
        table: 'recipes',
        field: 'id'
      },
      onDelete: 'SET NULL', // Allow null if recipe is deleted
      onUpdate: 'CASCADE'
    })
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraints in reverse order
    await queryInterface.removeConstraint('menus', 'menus_recipe_id_fk')
    await queryInterface.removeConstraint('shoppinglists', 'shoppinglists_user_id_fk')
    await queryInterface.removeConstraint('markets', 'markets_user_id_fk')
    await queryInterface.removeConstraint('products', 'products_market_id_fk')
    await queryInterface.removeConstraint('products', 'products_user_id_fk')
  }
}

