/**
 * Integration tests for recipe endpoints
 */

const request = require('supertest')
const app = require('../../server')
const {
  createTestUser,
  createTestRecipe,
  generateToken,
  getAuthHeaders,
  cleanupTestData,
  syncDatabase
} = require('../helpers/testHelpers')

describe('Recipe Endpoints', () => {
  let user, token

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
    user = await createTestUser()
    token = generateToken(user)
  })

  describe('GET /recipes', () => {
    it('should return paginated list of user recipes', async () => {
      await createTestRecipe(user.id)
      await createTestRecipe(user.id)

      const response = await request(app)
        .get('/recipes')
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('pagination')
      expect(response.body.data.length).toBeGreaterThanOrEqual(2)
    })

    it('should only return recipes for authenticated user', async () => {
      const user2 = await createTestUser({ email: 'user2@example.com' })
      await createTestRecipe(user.id)
      await createTestRecipe(user2.id)

      const response = await request(app)
        .get('/recipes')
        .set(getAuthHeaders(token))
        .expect(200)

      // Should only see own recipes
      response.body.data.forEach(recipe => {
        expect(recipe.user_id).toBe(user.id)
      })
    })

    it('should support pagination', async () => {
      // Create multiple recipes
      for (let i = 0; i < 15; i++) {
        await createTestRecipe(user.id, { title: `Recipe ${i}` })
      }

      const response = await request(app)
        .get('/recipes?page=1&limit=5')
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.pagination.limit).toBe(5)
      expect(response.body.data.length).toBeLessThanOrEqual(5)
    })
  })

  describe('GET /recipes/:id', () => {
    it('should return recipe by ID', async () => {
      const recipe = await createTestRecipe(user.id)

      const response = await request(app)
        .get(`/recipes/${recipe.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(recipe.id)
      expect(response.body.data.user_id).toBe(user.id)
    })

    it('should return 404 for non-existent recipe', async () => {
      const response = await request(app)
        .get('/recipes/99999')
        .set(getAuthHeaders(token))
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should reject accessing another user recipe', async () => {
      const user2 = await createTestUser({ email: 'user2@example.com' })
      const recipe = await createTestRecipe(user2.id)

      const response = await request(app)
        .get(`/recipes/${recipe.id}`)
        .set(getAuthHeaders(token))
        .expect(404) // Should not find it (filtered by user_id)

      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /recipes', () => {
    it('should create a new recipe', async () => {
      const recipeData = {
        idext: 12345,
        title: 'New Recipe',
        image: 'https://example.com/image.jpg',
        servings: 4,
        instructions: 'Cook it well'
      }

      const response = await request(app)
        .post('/recipes')
        .set(getAuthHeaders(token))
        .send(recipeData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(recipeData.title)
      expect(response.body.data.user_id).toBe(user.id)
    })

    it('should reject recipe with invalid data', async () => {
      const recipeData = {
        title: '', // Invalid: empty title
        image: 'not-a-url',
        servings: -1
      }

      const response = await request(app)
        .post('/recipes')
        .set(getAuthHeaders(token))
        .send(recipeData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('PUT /recipes/:id', () => {
    it('should update own recipe', async () => {
      const recipe = await createTestRecipe(user.id)

      const response = await request(app)
        .put(`/recipes/${recipe.id}`)
        .set(getAuthHeaders(token))
        .send({
          title: 'Updated Recipe Title'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe('Updated Recipe Title')
    })

    it('should reject updating another user recipe', async () => {
      const user2 = await createTestUser({ email: 'user2@example.com' })
      const recipe = await createTestRecipe(user2.id)

      const response = await request(app)
        .put(`/recipes/${recipe.id}`)
        .set(getAuthHeaders(token))
        .send({
          title: 'Updated Title'
        })
        .expect(404) // Not found due to user_id filter

      expect(response.body.success).toBe(false)
    })
  })

  describe('DELETE /recipes/:id', () => {
    it('should delete own recipe', async () => {
      const recipe = await createTestRecipe(user.id)

      const response = await request(app)
        .delete(`/recipes/${recipe.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)

      // Verify deletion
      const getResponse = await request(app)
        .get(`/recipes/${recipe.id}`)
        .set(getAuthHeaders(token))
        .expect(404)
    })

    it('should reject deleting another user recipe', async () => {
      const user2 = await createTestUser({ email: 'user2@example.com' })
      const recipe = await createTestRecipe(user2.id)

      const response = await request(app)
        .delete(`/recipes/${recipe.id}`)
        .set(getAuthHeaders(token))
        .expect(404) // Not found due to user_id filter

      expect(response.body.success).toBe(false)
    })
  })
})
