'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'ingredients',
			[
				{
					idext: 1,
					ingredients: JSON.stringify([
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
					servings: 4,
					instructions: 'cook chicken',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					idext: 2,
					ingredients: JSON.stringify([
						{
							name: 'beef',
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
					servings: 4,
					instructions: 'cook beef',
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					idext: 3,
					ingredients: JSON.stringify([
						{
							name: 'pork',
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
					servings: 4,
					instructions: 'cook pork',
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('ingredients', null, {})
	}
}
