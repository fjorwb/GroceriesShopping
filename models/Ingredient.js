'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ingredient.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idext: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
        },
      },
      ingredients: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isObject(value) {
            if (value === null || typeof value !== 'object') {
              throw new Error('ingredients must be a valid JSON object')
            }
          },
        },
      },
      servings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          isInt: true,
        },
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Ingredient',
      tableName: 'ingredients',
      underscored: true
    }
  )
  return Ingredient
}
