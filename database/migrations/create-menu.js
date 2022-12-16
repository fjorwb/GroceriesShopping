'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('menus', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			week: {
				type: Sequelize.INTEGER
			},
			date: {
				type: Sequelize.DATE
			},
			meal: {
				type: Sequelize.STRING
			},
			recipe_id: {
				type: Sequelize.INTEGER
			},
			recipe_title: {
				type: Sequelize.STRING
			},
			servings: {
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
		await queryInterface.dropTable('menus')
	}
}
