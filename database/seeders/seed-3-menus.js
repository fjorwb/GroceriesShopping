'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'menus',
      [
        // January 2025 - 3 recipes
        {
          id: 1,
          week: 1,
          date: '2025-01-15',
          meal: 'Breakfast',
          recipe_id: 1,
          recipe_title: 'Recipe 1',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          week: 1,
          date: '2025-01-15',
          meal: 'Lunch',
          recipe_id: 2,
          recipe_title: 'Recipe 2',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          week: 1,
          date: '2025-01-15',
          meal: 'Dinner',
          recipe_id: 3,
          recipe_title: 'Recipe 3',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // February 2025 - 2 recipes
        {
          id: 4,
          week: 5,
          date: '2025-02-10',
          meal: 'Lunch',
          recipe_id: 4,
          recipe_title: 'Recipe 4',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 5,
          week: 5,
          date: '2025-02-10',
          meal: 'Dinner',
          recipe_id: 5,
          recipe_title: 'Recipe 5',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // March 2025 - 3 recipes
        {
          id: 6,
          week: 9,
          date: '2025-03-08',
          meal: 'Breakfast',
          recipe_id: 6,
          recipe_title: 'Recipe 6',
          servings: 3,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 7,
          week: 9,
          date: '2025-03-08',
          meal: 'Lunch',
          recipe_id: 1,
          recipe_title: 'Recipe 1',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 8,
          week: 9,
          date: '2025-03-08',
          meal: 'Dinner',
          recipe_id: 2,
          recipe_title: 'Recipe 2',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // April 2025 - 2 recipes
        {
          id: 9,
          week: 14,
          date: '2025-04-12',
          meal: 'Breakfast',
          recipe_id: 3,
          recipe_title: 'Recipe 3',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 10,
          week: 14,
          date: '2025-04-12',
          meal: 'Dinner',
          recipe_id: 4,
          recipe_title: 'Recipe 4',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // May 2025 - 3 recipes
        {
          id: 11,
          week: 18,
          date: '2025-05-20',
          meal: 'Breakfast',
          recipe_id: 5,
          recipe_title: 'Recipe 5',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 12,
          week: 18,
          date: '2025-05-20',
          meal: 'Lunch',
          recipe_id: 6,
          recipe_title: 'Recipe 6',
          servings: 3,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 13,
          week: 18,
          date: '2025-05-20',
          meal: 'Dinner',
          recipe_id: 1,
          recipe_title: 'Recipe 1',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // June 2025 - 1 recipe
        {
          id: 14,
          week: 23,
          date: '2025-06-15',
          meal: 'Lunch',
          recipe_id: 2,
          recipe_title: 'Recipe 2',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // July 2025 - 2 recipes
        {
          id: 15,
          week: 27,
          date: '2025-07-04',
          meal: 'Breakfast',
          recipe_id: 3,
          recipe_title: 'Recipe 3',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 16,
          week: 27,
          date: '2025-07-04',
          meal: 'Dinner',
          recipe_id: 4,
          recipe_title: 'Recipe 4',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // August 2025 - 3 recipes
        {
          id: 17,
          week: 31,
          date: '2025-08-10',
          meal: 'Breakfast',
          recipe_id: 5,
          recipe_title: 'Recipe 5',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 18,
          week: 31,
          date: '2025-08-10',
          meal: 'Lunch',
          recipe_id: 6,
          recipe_title: 'Recipe 6',
          servings: 3,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 19,
          week: 31,
          date: '2025-08-10',
          meal: 'Dinner',
          recipe_id: 1,
          recipe_title: 'Recipe 1',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // September 2025 - 2 recipes
        {
          id: 20,
          week: 36,
          date: '2025-09-05',
          meal: 'Lunch',
          recipe_id: 2,
          recipe_title: 'Recipe 2',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 21,
          week: 36,
          date: '2025-09-05',
          meal: 'Dinner',
          recipe_id: 3,
          recipe_title: 'Recipe 3',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // October 2025 - 3 recipes
        {
          id: 22,
          week: 40,
          date: '2025-10-18',
          meal: 'Breakfast',
          recipe_id: 4,
          recipe_title: 'Recipe 4',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 23,
          week: 40,
          date: '2025-10-18',
          meal: 'Lunch',
          recipe_id: 5,
          recipe_title: 'Recipe 5',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 24,
          week: 40,
          date: '2025-10-18',
          meal: 'Dinner',
          recipe_id: 6,
          recipe_title: 'Recipe 6',
          servings: 3,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // November 2025 - 2 recipes
        {
          id: 25,
          week: 45,
          date: '2025-11-22',
          meal: 'Lunch',
          recipe_id: 1,
          recipe_title: 'Recipe 1',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 26,
          week: 45,
          date: '2025-11-22',
          meal: 'Dinner',
          recipe_id: 2,
          recipe_title: 'Recipe 2',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        // December 2025 - 3 recipes
        {
          id: 27,
          week: 50,
          date: '2025-12-25',
          meal: 'Breakfast',
          recipe_id: 3,
          recipe_title: 'Recipe 3',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 28,
          week: 50,
          date: '2025-12-25',
          meal: 'Lunch',
          recipe_id: 4,
          recipe_title: 'Recipe 4',
          servings: 4,
          factor: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 29,
          week: 50,
          date: '2025-12-25',
          meal: 'Dinner',
          recipe_id: 5,
          recipe_title: 'Recipe 5',
          servings: 4,
          factor: 1,
          user_id: 1,
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
