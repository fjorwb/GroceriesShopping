'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ingredients', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			idext: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			ingredients: {
				type: Sequelize.JSON
				// allowNull: false
			},
			servings: {
				type: Sequelize.INTEGER
				// allowNull: false
			},
			instructions: {
				type: Sequelize.TEXT
				// allowNull: false
			},
			user_id: {
				type: Sequelize.INTEGER
				// allowNull: false
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false
			}
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('ingredients')
	}
}
