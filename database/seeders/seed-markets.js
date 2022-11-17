'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'markets',
			[
				{
					name: 'Test Market',
					address: '123 Main St',
					city: 'Testville',
					state: 'TX',
					zip: '12345',
					country: 'USA',
					phone: '123-456-7890',
					email: 'market1@market1.com',
					website: 'http://market1.com',
					password: 'password',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					name: 'Test Market 2',
					address: '123 Main St',
					city: 'Testville',
					state: 'TX',
					zip: '12345',
					country: 'USA',
					phone: '123-456-7890',
					email: 'market2@market2.com',
					website: 'http://market2.com',
					password: 'password',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					name: 'Test Market 3',
					address: '123 Main St',
					city: 'Testville',
					state: 'TX',
					zip: '12345',
					country: 'USA',
					phone: '123-456-7890',
					email: 'market3@market3.com',
					website: 'http://market3.com',
					password: 'password',
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('markets', null, {})
	}
}
