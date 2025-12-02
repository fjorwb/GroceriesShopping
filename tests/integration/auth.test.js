/**
 * Integration tests for authentication endpoints
 */

const request = require('supertest')
const app = require('../../server')
const { createTestUser, cleanupTestData, syncDatabase } = require('../helpers/testHelpers')
const { User } = require('../../models/index')

describe('Authentication Endpoints', () => {
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

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password123',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
        phone: '1234567890'
      }

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(200)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user).not.toHaveProperty('password')
    })

    it('should reject registration with invalid email', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'invalid-email',
        password: 'Password123',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
        phone: '1234567890'
      }

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should reject registration with weak password', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'weak',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
        phone: '1234567890'
      }

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should reject registration with duplicate email', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password123',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
        phone: '1234567890'
      }

      // Create first user
      await createTestUser({ email: 'john@example.com' })

      // Try to register with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'test@example.com',
        password: 'Password123'
      })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123'
        })
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.email).toBe('test@example.com')
    })

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'Password123'
        })
        .expect(404)

      expect(response.body.message).toContain('User not found')
    })

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        })
        .expect(401)

      expect(response.body.message).toContain('Invalid')
    })
  })

  describe('POST /auth/changepassword', () => {
    let user, token

    beforeEach(async () => {
      user = await createTestUser({
        email: 'test@example.com',
        password: 'OldPassword123'
      })
      const jwt = require('jsonwebtoken')
      const authConfig = require('../../config/authConfig')
      token = jwt.sign({ id: user.id }, authConfig.secret)
    })

    it('should change password with valid current password', async () => {
      const response = await request(app)
        .post('/auth/changepassword')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'OldPassword123',
          newPassword: 'NewPassword123'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('Password changed')

      // Verify new password works
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewPassword123'
        })
        .expect(200)

      expect(loginResponse.body).toHaveProperty('token')
    })

    it('should reject password change with invalid current password', async () => {
      const response = await request(app)
        .post('/auth/changepassword')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword123'
        })
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('incorrect')
    })

    it('should reject password change without authentication', async () => {
      const response = await request(app)
        .post('/auth/changepassword')
        .send({
          currentPassword: 'OldPassword123',
          newPassword: 'NewPassword123'
        })
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})

