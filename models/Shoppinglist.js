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
			// define association here
		}
	}
	ShoppingList.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			barcode: {
				type: DataTypes.STRING,
				allowNull: false
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'ShoppingList',
			tableName: 'shopinglists',
			underscored: true
		}
	)
	return ShoppingList
}
