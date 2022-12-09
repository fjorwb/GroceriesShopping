'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Recipe extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Recipe.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			idext: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false
			},
			image: {
				type: DataTypes.STRING,
				allowNull: false
			},
			servings: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			instructions: {
				type: DataTypes.TEXT,
				allowNull: false
			}
		},

		{
			sequelize,
			modelName: 'Recipe',
			tableName: 'recipes',
			underscored: true
		}
	)
	return Recipe
}
