/**
 * Test helper utilities
 */

const { User, Recipe, Product, ShoppingList, Market, Menu, Ingredient, ProductCategory } = require('../../models/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/authConfig')

/**
 * Create a test user
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstname: 'Test',
    lastname: 'User',
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test1234',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
    country: 'USA',
    phone: '1234567890',
    role: 'user',
    ...userData
  }

  // Hash password
  defaultUser.password = bcrypt.hashSync(defaultUser.password, Number(authConfig.rounds))

  return await User.create(defaultUser)
}

/**
 * Create a test admin user
 */
const createTestAdmin = async () => {
  return await createTestUser({
    username: `admin_${Date.now()}`,
    email: `admin_${Date.now()}@example.com`,
    role: 'admin'
  })
}

/**
 * Generate JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn
  })
}

/**
 * Create authenticated request headers
 */
const getAuthHeaders = (token) => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

/**
 * Create a test recipe
 */
const createTestRecipe = async (userId, recipeData = {}) => {
  const defaultRecipe = {
    idext: Math.floor(Math.random() * 1000000),
    title: 'Test Recipe',
    image: 'https://example.com/image.jpg',
    servings: 4,
    instructions: 'Test instructions',
    user_id: userId,
    ...recipeData
  }

  return await Recipe.create(defaultRecipe)
}

/**
 * Create a test product
 */
const createTestProduct = async (userId, marketId, productData = {}) => {
  const defaultProduct = {
    barcode: `123456789012${Date.now()}`,
    extid: Math.floor(Math.random() * 1000000),
    name: 'Test Product',
    description: 'Test product description',
    presentation: '500g',
    unit: 'g',
    price: 9.99,
    market_id: marketId,
    category: 'Test Category',
    user_id: userId,
    ...productData
  }

  return await Product.create(defaultProduct)
}

/**
 * Create a test market
 */
const createTestMarket = async (userId, marketData = {}) => {
  const defaultMarket = {
    name: 'Test Market',
    address: '123 Market St',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
    country: 'USA',
    phone: '1234567890',
    email: `market_${Date.now()}@example.com`,
    website: 'https://testmarket.com',
    password: 'marketpass123',
    user_id: userId,
    ...marketData
  }

  return await Market.create(defaultMarket)
}

/**
 * Create a test shopping list
 */
const createTestShoppingList = async (userId, listData = {}) => {
  const defaultList = {
    shop_list_id: `list_${Date.now()}`,
    shop_list: { items: ['item1', 'item2'] },
    user_id: userId,
    ...listData
  }

  return await ShoppingList.create(defaultList)
}

/**
 * Create a test menu
 */
const createTestMenu = async (userId, recipeId, menuData = {}) => {
  const defaultMenu = {
    week: 1,
    date: new Date(),
    meal: 'breakfast',
    recipe_id: recipeId,
    idext: Math.floor(Math.random() * 1000000),
    recipe_title: 'Test Recipe',
    servings: 4,
    factor: 1,
    user_id: userId,
    ...menuData
  }

  return await Menu.create(defaultMenu)
}

/**
 * Create a test ingredient
 */
const createTestIngredient = async (userId, ingredientData = {}) => {
  const defaultIngredient = {
    idext: Math.floor(Math.random() * 1000000),
    ingredients: { items: ['ingredient1', 'ingredient2'] },
    servings: 4,
    instructions: 'Test instructions',
    user_id: userId,
    ...ingredientData
  }

  return await Ingredient.create(defaultIngredient)
}

/**
 * Create a test product category
 */
const createTestProductCategory = async (categoryData = {}) => {
  const defaultCategory = {
    category: `Category_${Date.now()}`,
    ...categoryData
  }

  return await ProductCategory.create(defaultCategory)
}

/**
 * Clean up test data
 */
const cleanupTestData = async () => {
  // Delete in reverse order of dependencies
  await Menu.destroy({ where: {}, force: true })
  await ShoppingList.destroy({ where: {}, force: true })
  await Product.destroy({ where: {}, force: true })
  await Ingredient.destroy({ where: {}, force: true })
  await Recipe.destroy({ where: {}, force: true })
  await Market.destroy({ where: {}, force: true })
  await ProductCategory.destroy({ where: {}, force: true })
  await User.destroy({ where: {}, force: true })
}

/**
 * Sync database for tests
 */
const syncDatabase = async () => {
  const { sequelize } = require('../../models/index')
  await sequelize.sync({ force: true })
}

module.exports = {
  createTestUser,
  createTestAdmin,
  generateToken,
  getAuthHeaders,
  createTestRecipe,
  createTestProduct,
  createTestMarket,
  createTestShoppingList,
  createTestMenu,
  createTestIngredient,
  createTestProductCategory,
  cleanupTestData,
  syncDatabase
}
