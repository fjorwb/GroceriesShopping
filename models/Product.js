'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Product.belongsTo(models.User), Product.belongsTo(models.Market)
		}
	}
	Product.init(
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
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false
			},
			unit: {
				type: DataTypes.STRING,
				allowNull: false
			},
			presentation: {
				type: DataTypes.STRING,
				allowNull: false
			},
			market_id: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			category: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: 'Others'
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'Product',
			tableName: 'products',
			underscored: true
		}
	)
	return Product
}
