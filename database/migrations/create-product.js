'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('products', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			barcode: {
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING
			},
			unit: {
				type: Sequelize.STRING
			},
			presentation: {
				type: Sequelize.STRING
			},
			category: {
				type: Sequelize.STRING
			},
			market_id: {
				type: Sequelize.INTEGER
			},
			user_id: {
				type: Sequelize.INTEGER
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('products')
	}
}
