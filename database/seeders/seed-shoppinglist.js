'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'shoppinglists',
			[
				{
					shop_list: JSON.stringify([
						{
							name: 'chicken',
							amount: 1,
							unit: 'lb'
						},
						{
							name: 'salt',
							amount: 1,
							unit: 'tsp'
						},
						{
							name: 'pepper',
							amount: 1,
							unit: 'tsp'
						}
					]),
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					shop_list: JSON.stringify([
						{
							name: 'chicken',
							amount: 1,
							unit: 'lb'
						},
						{
							name: 'salt',
							amount: 1,
							unit: 'tsp'
						},
						{
							name: 'pepper',
							amount: 1,
							unit: 'tsp'
						}
					]),
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					shop_list: JSON.stringify([
						{
							name: 'chicken',
							amount: 1,
							unit: 'lb'
						},
						{
							name: 'salt',
							amount: 1,
							unit: 'tsp'
						},
						{
							name: 'pepper',
							amount: 1,
							unit: 'tsp'
						}
					]),
					user_id: 2,
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
