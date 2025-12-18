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
          image:
            'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
          servings: 4,
          instructions: 'Instructions for Recipe 1',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          idext: 2,
          title: 'Recipe 2',
          image:
            'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
          servings: 4,
          instructions: 'Instructions for Recipe 2',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          idext: 3,
          title: 'Recipe 3',
          image:
            'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
          servings: 4,
          instructions: 'Instructions for Recipe 3',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          idext: 4,
          title: 'Recipe 4',
          image:
            'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
          servings: 4,
          instructions: 'Instructions for Recipe 4',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          idext: 5,
          title: 'Recipe 5',
          image:
            'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
          servings: 4,
          instructions: 'Instructions for Recipe 5',
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          idext: 6,
          title: 'Recipe 6',
          image:
            'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
          servings: 3,
          instructions: 'Instructions for Recipe 6',
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
