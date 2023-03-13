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
					category: 'Cereals',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Beverages',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Dairy',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Bakery',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Delicatessen',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Liquors',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Meat',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Seafood',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Fish',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Seasonings',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Canned Goods',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Beans',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					category: 'Grains',
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
