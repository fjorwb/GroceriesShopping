'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Market extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// Market.hasMany(models.User)
		}
	}
	Market.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			address: DataTypes.STRING,
			city: DataTypes.STRING,
			state: DataTypes.STRING,
			zip: DataTypes.STRING,
			country: DataTypes.STRING,
			phone: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				allowNull: false
			},
			website: {
				type: DataTypes.STRING,
				allowNull: false
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'Market',
			tableName: 'markets',
			underscored: true
		}
	)
	return Market
}
