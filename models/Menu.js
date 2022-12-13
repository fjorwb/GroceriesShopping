'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Menu extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Recipe.hasMany(models.User, {
				foreignKey: 'user_id',
				as: 'user'
			})
			// define association here
		}
	}
	Menu.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			week: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false
			},
			meal: {
				type: DataTypes.STRING,
				allowNull: false
			},
			recipe_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'Menu',
			tableName: 'menus',
			underscored: true
		}
	)
	return Menu
}
