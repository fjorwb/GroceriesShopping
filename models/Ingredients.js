'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Ingredients extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Ingredients.init(
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
			ingredients: {
				type: DataTypes.JSON,
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
			modelName: 'Ingredients',
			tableName: 'ingredients',
			underscored: true
		}
	)
	return Ingredients
}
