'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'shoppinglists',
			[
				{
					barcode: '1234567890123',
					quantity: 1,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					barcode: '1234567890124',
					quantity: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					barcode: '1234567890125',
					quantity: 3,
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('shoppinglists', null, {})
	}
}
