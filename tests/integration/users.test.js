/**
 * Integration tests for user management endpoints
 */

const request = require('supertest')
const app = require('../../server')
const {
  createTestUser,
  createTestAdmin,
  generateToken,
  getAuthHeaders,
  cleanupTestData,
  syncDatabase
} = require('../helpers/testHelpers')

describe('User Management Endpoints', () => {
  beforeAll(async () => {
    await syncDatabase()
  })

  afterAll(async () => {
    await cleanupTestData()
    const { sequelize } = require('../../models/index')
    await sequelize.close()
  })

  beforeEach(async () => {
    await cleanupTestData()
  })

  describe('GET /users', () => {
    it('should return paginated list of users for admin', async () => {
      const admin = await createTestAdmin()
      const token = generateToken(admin)

      // Create some test users
      await createTestUser({ email: 'user1@example.com' })
      await createTestUser({ email: 'user2@example.com' })

      const response = await request(app)
        .get('/users')
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('pagination')
      expect(response.body.pagination).toHaveProperty('page')
      expect(response.body.pagination).toHaveProperty('limit')
      expect(response.body.pagination).toHaveProperty('total')
    })

    it('should reject non-admin users from viewing all users', async () => {
      const user = await createTestUser()
      const token = generateToken(user)

      const response = await request(app)
        .get('/users')
        .set(getAuthHeaders(token))
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('admin')
    })

    it('should support pagination parameters', async () => {
      const admin = await createTestAdmin()
      const token = generateToken(admin)

      // Create multiple users
      for (let i = 0; i < 15; i++) {
        await createTestUser({ email: `user${i}@example.com` })
      }

      const response = await request(app)
        .get('/users?page=1&limit=5')
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.pagination.limit).toBe(5)
      expect(response.body.pagination.page).toBe(1)
      expect(response.body.data.length).toBeLessThanOrEqual(5)
    })
  })

  describe('GET /users/:id', () => {
    it('should return user by ID for own user', async () => {
      const user = await createTestUser()
      const token = generateToken(user)

      const response = await request(app)
        .get(`/users/${user.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(user.id)
      expect(response.body.data).not.toHaveProperty('password')
    })

    it('should return user by ID for admin viewing any user', async () => {
      const admin = await createTestAdmin()
      const user = await createTestUser()
      const token = generateToken(admin)

      const response = await request(app)
        .get(`/users/${user.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(user.id)
    })

    it('should reject user viewing another user', async () => {
      const user1 = await createTestUser()
      const user2 = await createTestUser()
      const token = generateToken(user1)

      const response = await request(app)
        .get(`/users/${user2.id}`)
        .set(getAuthHeaders(token))
        .expect(403)

      expect(response.body.success).toBe(false)
    })

    it('should return 404 for non-existent user', async () => {
      const user = await createTestUser()
      const token = generateToken(user)

      const response = await request(app)
        .get('/users/99999')
        .set(getAuthHeaders(token))
        .expect(404)

      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /users', () => {
    it('should create user for admin', async () => {
      const admin = await createTestAdmin()
      const token = generateToken(admin)

      const newUserData = {
        firstname: 'New',
        lastname: 'User',
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123',
        address: '123 St',
        city: 'City',
        state: 'ST',
        zip_code: '12345',
        country: 'USA',
        phone: '1234567890',
        role: 'user'
      }

      const response = await request(app)
        .post('/users')
        .set(getAuthHeaders(token))
        .send(newUserData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.email).toBe(newUserData.email)
      expect(response.body.data).not.toHaveProperty('password')
    })

    it('should reject non-admin from creating users', async () => {
      const user = await createTestUser()
      const token = generateToken(user)

      const response = await request(app)
        .post('/users')
        .set(getAuthHeaders(token))
        .send({
          firstname: 'New',
          lastname: 'User',
          email: 'new@example.com',
          password: 'Password123'
        })
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('admin')
    })
  })

  describe('PUT /users/:id', () => {
    it('should update own user', async () => {
      const user = await createTestUser()
      const token = generateToken(user)

      const response = await request(app)
        .put(`/users/${user.id}`)
        .set(getAuthHeaders(token))
        .send({
          firstname: 'Updated',
          lastname: 'Name'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.firstname).toBe('Updated')
    })

    it('should reject updating another user', async () => {
      const user1 = await createTestUser()
      const user2 = await createTestUser()
      const token = generateToken(user1)

      const response = await request(app)
        .put(`/users/${user2.id}`)
        .set(getAuthHeaders(token))
        .send({
          firstname: 'Updated'
        })
        .expect(403)

      expect(response.body.success).toBe(false)
    })
  })

  describe('DELETE /users/:id', () => {
    it('should delete own user', async () => {
      const user = await createTestUser()
      const token = generateToken(user)

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
    })

    it('should allow admin to delete any user', async () => {
      const admin = await createTestAdmin()
      const user = await createTestUser()
      const token = generateToken(admin)

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
    })

    it('should reject deleting another user', async () => {
      const user1 = await createTestUser()
      const user2 = await createTestUser()
      const token = generateToken(user1)

      const response = await request(app)
        .delete(`/users/${user2.id}`)
        .set(getAuthHeaders(token))
        .expect(403)

      expect(response.body.success).toBe(false)
    })
  })
})
