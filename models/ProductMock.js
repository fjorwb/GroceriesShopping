'use strict'
const {Model} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class ProductMock extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// ProductMock.belongsTo(models.User), ProductMock.belongsTo(models.Market)
		}
	}
	ProductMock.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			barcode: {
				type: DataTypes.STRING
			},
			idext: {
				type: DataTypes.INTEGER
			},
			name: {
				type: DataTypes.STRING
			},
			presentation: {
				type: DataTypes.STRING
			},
			unit: {
				type: DataTypes.STRING
			},
			amount: {
				type: DataTypes.DECIMAL(10, 3),
				defaultValue: 0
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				defaultValue: 0
			},
			total: {
				type: DataTypes.DECIMAL(10, 2),
				defaultValue: 0
			},
			market_id: {
				type: DataTypes.INTEGER
			},
			user_id: {
				type: DataTypes.INTEGER
			}
		},
		{
			sequelize,
			modelName: 'ProductMock',
			tableName: 'productsmock',
			underscored: true
		}
	)
	return ProductMock
}
