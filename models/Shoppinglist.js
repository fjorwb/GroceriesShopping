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
			ShoppingList.belongsTo(models.User)
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
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'ShoppingList',
			tableName: 'shoppinglists',
			underscored: true
		}
	)
	return ShoppingList
}
