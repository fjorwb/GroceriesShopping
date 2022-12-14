'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'menus',
			[
				{
					id: 1,
					week: 1,
					date: '2021-01-01',
					meal: 'Breakfast',
					recipe_id: 1,
					recipe_title: 'Recipe 1',
					servings: 4,
					factor: 1,
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 2,
					week: 1,
					date: '2021-01-01',
					meal: 'Lunch',
					recipe_id: 2,
					recipe_title: 'Recipe 2',
					servings: 4,
					factor: 1,
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 3,
					week: 1,
					date: '2021-01-01',
					meal: 'Dinner',
					recipe_id: 3,
					recipe_title: 'Recipe 3',
					servings: 4,
					factor: 1,
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 4,
					week: 1,
					date: '2021-01-02',
					meal: 'Breakfast',
					recipe_id: 4,
					idext: 1,
					recipe_title: 'Recipe 4',
					servings: 4,
					factor: 1,
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 5,
					week: 1,
					date: '2021-01-02',
					meal: 'Dinner',
					recipe_id: 5,
					idext: 2,
					recipe_title: 'Recipe 5',
					servings: 4,
					factor: 1,
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					id: 6,
					week: 1,
					date: '2021-01-03',
					meal: 'Lunch',
					recipe_id: 6,
					idext: 3,
					recipe_title: 'Recipe 6',
					servings: 3,
					factor: 1,
					user_id: 2,
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('menus', null, {})
	}
}
