'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add indexes for frequently queried fields

    // Users table indexes
    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_idx',
      unique: true
    })
    await queryInterface.addIndex('users', ['username'], {
      name: 'users_username_idx',
      unique: true
    })

    // Recipes table indexes
    await queryInterface.addIndex('recipes', ['user_id'], {
      name: 'recipes_user_id_idx'
    })
    await queryInterface.addIndex('recipes', ['idext'], {
      name: 'recipes_idext_idx'
    })

    // Products table indexes
    await queryInterface.addIndex('products', ['user_id'], {
      name: 'products_user_id_idx'
    })
    await queryInterface.addIndex('products', ['market_id'], {
      name: 'products_market_id_idx'
    })
    await queryInterface.addIndex('products', ['extid'], {
      name: 'products_extid_idx'
    })

    // Shopping lists table indexes
    await queryInterface.addIndex('shoppinglists', ['user_id'], {
      name: 'shoppinglists_user_id_idx'
    })
    await queryInterface.addIndex('shoppinglists', ['shop_list_id'], {
      name: 'shoppinglists_shop_list_id_idx'
    })

    // Menus table indexes
    await queryInterface.addIndex('menus', ['user_id'], {
      name: 'menus_user_id_idx'
    })
    await queryInterface.addIndex('menus', ['recipe_id'], {
      name: 'menus_recipe_id_idx'
    })

    // Ingredients table indexes
    await queryInterface.addIndex('ingredients', ['idext'], {
      name: 'ingredients_idext_idx'
    })

    // Markets table indexes
    await queryInterface.addIndex('markets', ['email'], {
      name: 'markets_email_idx',
      unique: true
    })
    await queryInterface.addIndex('markets', ['user_id'], {
      name: 'markets_user_id_idx'
    })
  },

  async down(queryInterface, Sequelize) {
    // Remove all indexes in reverse order
    await queryInterface.removeIndex('markets', 'markets_user_id_idx')
    await queryInterface.removeIndex('markets', 'markets_email_idx')
    await queryInterface.removeIndex('ingredients', 'ingredients_idext_idx')
    await queryInterface.removeIndex('menus', 'menus_recipe_id_idx')
    await queryInterface.removeIndex('menus', 'menus_user_id_idx')
    await queryInterface.removeIndex('shoppinglists', 'shoppinglists_shop_list_id_idx')
    await queryInterface.removeIndex('shoppinglists', 'shoppinglists_user_id_idx')
    await queryInterface.removeIndex('products', 'products_extid_idx')
    await queryInterface.removeIndex('products', 'products_market_id_idx')
    await queryInterface.removeIndex('products', 'products_user_id_idx')
    await queryInterface.removeIndex('recipes', 'recipes_idext_idx')
    await queryInterface.removeIndex('recipes', 'recipes_user_id_idx')
    await queryInterface.removeIndex('users', 'users_username_idx')
    await queryInterface.removeIndex('users', 'users_email_idx')
  }
}
