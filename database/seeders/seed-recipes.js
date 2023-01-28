'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'recipes',
			[
				{
					idext: 1,
					title: 'Recipe 1',
					image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
					servings: 4,
					instructions: 'Instructions for Recipe 1',
					user_id: 1,
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					idext: 2,
					title: 'Recipe 2',
					image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
					servings: 4,
					instructions: 'Instructions for Recipe 2',
					user_id: 1,
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('recipes', null, {})
	}
}
