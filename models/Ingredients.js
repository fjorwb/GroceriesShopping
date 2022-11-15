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
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			unit: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'Ingredients',
			tableName: 'ingredients'
		}
	)
	return Recipe
}
