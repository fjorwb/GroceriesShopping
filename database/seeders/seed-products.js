'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'products',
			[
				{
					barcode: '123456789',
					name: 'Product 1',
					description: 'Product 1 description',
					unit: 'Unit 1',
					presentation: 'Presentation 1',
					category: 'vegetables',
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					barcode: '987654321',
					name: 'Product 2',
					description: 'Product 2 description',
					unit: 'Unit 2',
					presentation: 'Presentation 2',
					category: 'vegetables',
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					barcode: '123456789',
					name: 'Product 3',
					description: 'Product 3 description',
					unit: 'Unit 3',
					presentation: 'Presentation 3',
					category: 'fruit',
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('products', null, {})
	}
}
