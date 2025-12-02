/* eslint-disable no-tabs */
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ShoppingList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShoppingList.belongsTo(models.User, { foreignKey: 'user_id' })
    }
  }
  ShoppingList.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      shop_list_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      shop_list: {
        type: DataTypes.JSON,
        // allowNull: false
        validate: {
          isObject(value) {
            if (value !== null && typeof value !== 'object') {
              throw new Error('shop_list must be a valid JSON object')
            }
          },
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ShoppingList',
      tableName: 'shoppinglists',
      underscored: true,
    }
  )
  return ShoppingList
}
