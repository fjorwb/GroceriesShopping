'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Users',
			[
				{
					id: 1,
					username: 'username1',
					email: 'user1@email.com',
					password: 'secret',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 2,
					username: 'username2',
					email: 'user2@email.com',
					password: 'secret',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 3,
					username: 'username3',
					email: 'user3@email.com',
					password: 'secret',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 4,
					username: 'username4',
					email: 'user4@email.com',
					password: 'secret',
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Users', null, {})
	}
}
