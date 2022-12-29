'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'productcategories',
			[
				{
					category: 'Vegetables',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Fruit',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'grains',
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('productcategories', null, {})
	}
}
