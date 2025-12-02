/**
 * Integration tests for shopping list endpoints
 */

const request = require('supertest')
const app = require('../../server')
const {
  createTestUser,
  createTestShoppingList,
  generateToken,
  getAuthHeaders,
  cleanupTestData,
  syncDatabase
} = require('../helpers/testHelpers')

describe('Shopping List Endpoints', () => {
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

  describe('GET /shoppinglists', () => {
    it('should return paginated list of user shopping lists', async () => {
      await createTestShoppingList(user.id)
      await createTestShoppingList(user.id)

      const response = await request(app)
        .get('/shoppinglists')
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('pagination')
    })

    it('should only return shopping lists for authenticated user', async () => {
      const user2 = await createTestUser({ email: 'user2@example.com' })
      await createTestShoppingList(user.id)
      await createTestShoppingList(user2.id)

      const response = await request(app)
        .get('/shoppinglists')
        .set(getAuthHeaders(token))
        .expect(200)

      response.body.data.forEach(list => {
        expect(list.user_id).toBe(user.id)
      })
    })
  })

  describe('GET /shoppinglists/:id', () => {
    it('should return shopping list by ID', async () => {
      const list = await createTestShoppingList(user.id)

      const response = await request(app)
        .get(`/shoppinglists/${list.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(list.id)
    })
  })

  describe('POST /shoppinglists', () => {
    it('should create a new shopping list', async () => {
      const listData = {
        shop_list_id: 'list_123',
        shop_list: {
          items: ['milk', 'bread', 'eggs']
        }
      }

      const response = await request(app)
        .post('/shoppinglists')
        .set(getAuthHeaders(token))
        .send(listData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.shop_list_id).toBe(listData.shop_list_id)
      expect(response.body.data.user_id).toBe(user.id)
    })
  })

  describe('PUT /shoppinglists/:id', () => {
    it('should update own shopping list', async () => {
      const list = await createTestShoppingList(user.id)

      const response = await request(app)
        .put(`/shoppinglists/${list.id}`)
        .set(getAuthHeaders(token))
        .send({
          shop_list: {
            items: ['updated', 'items']
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })

  describe('DELETE /shoppinglists/:id', () => {
    it('should delete own shopping list', async () => {
      const list = await createTestShoppingList(user.id)

      const response = await request(app)
        .delete(`/shoppinglists/${list.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })
})

