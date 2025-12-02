/**
 * Integration tests for product endpoints
 */

const request = require('supertest')
const app = require('../../server')
const {
  createTestUser,
  createTestProduct,
  createTestMarket,
  generateToken,
  getAuthHeaders,
  cleanupTestData,
  syncDatabase
} = require('../helpers/testHelpers')

describe('Product Endpoints', () => {
  let user, market, token

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
    market = await createTestMarket(user.id)
    token = generateToken(user)
  })

  describe('GET /products', () => {
    it('should return paginated list of user products', async () => {
      await createTestProduct(user.id, market.id)
      await createTestProduct(user.id, market.id)

      const response = await request(app)
        .get('/products')
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('pagination')
      expect(response.body.data.length).toBeGreaterThanOrEqual(2)
    })

    it('should only return products for authenticated user', async () => {
      const user2 = await createTestUser({ email: 'user2@example.com' })
      const market2 = await createTestMarket(user2.id)
      await createTestProduct(user.id, market.id)
      await createTestProduct(user2.id, market2.id)

      const response = await request(app)
        .get('/products')
        .set(getAuthHeaders(token))
        .expect(200)

      response.body.data.forEach(product => {
        expect(product.user_id).toBe(user.id)
      })
    })
  })

  describe('GET /products/:id', () => {
    it('should return product by ID', async () => {
      const product = await createTestProduct(user.id, market.id)

      const response = await request(app)
        .get(`/products/${product.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(product.id)
    })

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/products/99999')
        .set(getAuthHeaders(token))
        .expect(404)
    })
  })

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const productData = {
        barcode: '1234567890123',
        extid: 12345,
        name: 'Test Product',
        description: 'A test product',
        presentation: '500g',
        unit: 'g',
        price: 9.99,
        market_id: market.id,
        category: 'Food'
      }

      const response = await request(app)
        .post('/products')
        .set(getAuthHeaders(token))
        .send(productData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(productData.name)
      expect(response.body.data.user_id).toBe(user.id)
    })

    it('should reject product with invalid price', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: -10, // Invalid: negative price
        market_id: market.id
      }

      const response = await request(app)
        .post('/products')
        .set(getAuthHeaders(token))
        .send(productData)
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('PUT /products/:id', () => {
    it('should update own product', async () => {
      const product = await createTestProduct(user.id, market.id)

      const response = await request(app)
        .put(`/products/${product.id}`)
        .set(getAuthHeaders(token))
        .send({
          name: 'Updated Product Name',
          price: 19.99
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Updated Product Name')
    })
  })

  describe('DELETE /products/:id', () => {
    it('should delete own product', async () => {
      const product = await createTestProduct(user.id, market.id)

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set(getAuthHeaders(token))
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })
})

