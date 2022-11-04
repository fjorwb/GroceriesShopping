'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {}
	}
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: { msg: 'Email is not valid' } }
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: false,
					len: { args: [8, 100], msg: 'Password must be between 8 and 20 characters' }
				}
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: { isAlpha: { msg: 'username name must be letters only' } }
			}
		},
		{
			sequelize,
			modelName: 'User'
		}
	)
	return User
}
