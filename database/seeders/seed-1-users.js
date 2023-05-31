'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          firstname: 'User',
          lastname: 'One',
          username: 'username1',
          email: 'user1@email.com',
          password:
            '$2b$10$SroIu01/GcadFXdeZYtAq.NfwE9WQ1xL2FhYGnGymNqlcwXQhcHFq',
          address: '123 Main St',
          address2: 'Apt 1',
          city: 'New York',
          state: 'NY',
          zip_code: '10001',
          country: 'USA',
          phone: '123-456-7890',

          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          firstname: 'User',
          lastname: 'Two',
          username: 'username2',
          email: 'user2@email.com',
          password:
            '$2b$10$SroIu01/GcadFXdeZYtAq.NfwE9WQ1xL2FhYGnGymNqlcwXQhcHFq',
          address: '222 Second Ave',
          address2: 'Apt 22',
          city: 'Chicago',
          state: 'IL',
          zip_code: '60007',
          country: 'USA',
          phone: '222-222-22222',
          role: 'manager',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          firstname: 'User',
          lastname: 'Three',
          username: 'username3',
          email: 'user3@email.com',
          password:
            '$2b$10$SroIu01/GcadFXdeZYtAq.NfwE9WQ1xL2FhYGnGymNqlcwXQhcHFq',
          address: '333 Third Pl',
          address2: '',
          city: 'New Orleans',
          state: 'AL',
          zip_code: '70032',
          country: 'USA',
          phone: '333-333-3333',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 4,
          firstname: 'User',
          lastname: 'Four',
          username: 'username4',
          email: 'user4@email.com',
          password:
            '$2b$10$SroIu01/GcadFXdeZYtAq.NfwE9WQ1xL2FhYGnGymNqlcwXQhcHFq',
          address: '444 Fourth St',
          address2: 'Apt 4',
          city: 'West Vancouver',
          state: 'BC',
          zip_code: 'V7T 1H8',
          country: 'Canada',
          phone: '444-444-4444',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  }
}
