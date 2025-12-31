require('dotenv').config()
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const db = require('../models')

const RapidAPI_Key = process.env.RAPIDAPI_KEY
const RapidAPI_Host = process.env.RAPIDAPI_HOST

console.log('-----------------------------------------')

// Validate API credentials are set
if (!RapidAPI_Key || !RapidAPI_Host) {
  console.error('ERROR: RAPIDAPI_KEY and RAPIDAPI_HOST environment variables must be set')
  process.exit(1)
}

const data = require('./mockRecipesCopy.json')

const recipes = []
const ingredients = []
let counter = 0

function list(data) {
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    recipes.push(element.id)
  }
}

list(data)
console.log('Recipe IDs:', recipes)

/**
 * Retry function with exponential backoff
 */
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getIngredients(idext, retryCount = 0) {
  const MAX_RETRIES = 3
  const BASE_DELAY = 2000 // 2 seconds base delay

  // Check if ingredient already exists
  const checkIngredient = ingredients.find((ingredient) => ingredient && ingredient.idext === idext)

  if (checkIngredient) {
    console.log(`Ingredient with idext ${idext} already exists, skipping...`)
    return checkIngredient
  }

  counter++
  console.log(`[${counter}] Fetching ingredients for recipe ID: ${idext}${retryCount > 0 ? ` (retry ${retryCount}/${MAX_RETRIES})` : ''}`)

  try {
    const options = {
      method: 'GET',
      url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
      params: { includeNutrition: 'false' },
      headers: {
        'X-RapidAPI-Key': RapidAPI_Key,
        'X-RapidAPI-Host': RapidAPI_Host,
      },
    }

    const response = await axios.request(options)
    const { id, extendedIngredients, servings, instructions } = response.data

    const ingredientData = {
      idext: id,
      ingredients: extendedIngredients,
      servings,
      instructions,
    }

    return ingredientData
  } catch (err) {
    const statusCode = err.response?.status
    const errorMessage = err.response?.data?.message || err.message

    // Handle rate limiting (429) with retry
    if (statusCode === 429 && retryCount < MAX_RETRIES) {
      const delay = BASE_DELAY * Math.pow(2, retryCount) // Exponential backoff: 2s, 4s, 8s
      const retryAfter = err.response?.headers['retry-after'] || delay / 1000

      console.warn(`⚠️  Rate limited (429) for recipe ${idext}. Waiting ${retryAfter}s before retry ${retryCount + 1}/${MAX_RETRIES}...`)
      await sleep(retryAfter * 1000)
      return getIngredients(idext, retryCount + 1)
    }

    // Handle forbidden (403) - likely API key issue
    if (statusCode === 403) {
      console.error(`❌ Forbidden (403) for recipe ${idext}. This may indicate an invalid API key or insufficient permissions.`)
      console.error(`   Error: ${errorMessage}`)
      return null
    }

    // Handle other errors
    if (statusCode) {
      console.error(`❌ Error ${statusCode} fetching ingredients for recipe ${idext}: ${errorMessage}`)
    } else {
      console.error(`❌ Network error fetching ingredients for recipe ${idext}: ${errorMessage}`)
    }

    // Return null to indicate failure, but don't throw to continue processing other recipes
    return null
  }
}

async function loopForIngredients(data) {
  console.log(`\nProcessing ${data.length} recipes...\n`)

  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    const idext = element.id

    if (!idext) {
      console.warn(`Skipping element at index ${i}: missing id`)
      continue
    }

    const ingredientData = await getIngredients(idext)

    // Only push if we got valid data
    if (ingredientData) {
      ingredients.push(ingredientData)
    }

    // Add delay between requests to avoid rate limiting (increased to 500ms)
    if (i < data.length - 1) {
      await sleep(500)
    }
  }

  console.log(`\nCompleted processing. Total ingredients fetched: ${ingredients.length}`)
  convertToJSON(ingredients)
}

function convertToJSON(ingredients) {
  // Filter out any null/undefined entries
  const validIngredients = ingredients.filter(ing => ing !== null && ing !== undefined)

  const json = JSON.stringify(validIngredients, null, 2)
  fs.writeFile('./MockData/ingredients.json', json, (err) => {
    if (err) {
      console.error('Error writing JSON file:', err)
      process.exit(1)
    } else {
      console.log(`\n✅ JSON file created successfully with ${validIngredients.length} ingredients.`)
      console.log('File location: ./MockData/ingredients.json')

      // Generate products mock data after ingredients are saved
      generateProductsMockData()
    }
  })
}

/**
 * Generate products mock data from ingredients.json and markets
 */
function generateProductsMockData() {
  console.log('\n-----------------------------------------')
  console.log('Generating products mock data from ingredients.json...\n')

  // Load ingredients from ingredients.json
  let ingredientsData
  try {
    ingredientsData = require('./ingredients.json')
    console.log(`Loaded ${ingredientsData.length} recipe(s) from ingredients.json`)
  } catch (err) {
    console.error('Error loading ingredients.json:', err.message)
    return
  }

  // Extract unique ingredients from all recipes
  const ingredientsList = []
  const seenIngredients = new Set()

  ingredientsData.forEach((recipe) => {
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach((ingredient) => {
        const ingredientName = ingredient.name.toLowerCase()
        if (!seenIngredients.has(ingredientName)) {
          seenIngredients.add(ingredientName)

          // Map ingredient to appropriate category
          let category = 'Others'
          let presentation = 'Package'
          let basePrice = 2.99

          if (ingredient.aisle) {
            if (ingredient.aisle.toLowerCase().includes('meat')) {
              category = 'Meat & Poultry'
              presentation = 'Package'
              basePrice = 5.99
            } else if (ingredient.aisle.toLowerCase().includes('spice') || ingredient.aisle.toLowerCase().includes('seasoning')) {
              category = 'Spices & Seasonings'
              presentation = ingredient.unit === 'lb' ? 'Box' : 'Bottle'
              basePrice = ingredient.name === 'salt' ? 1.29 : 2.99
            } else if (ingredient.aisle.toLowerCase().includes('produce')) {
              category = 'Produce'
              presentation = 'Fresh'
              basePrice = 3.49
            } else if (ingredient.aisle.toLowerCase().includes('dairy')) {
              category = 'Dairy'
              presentation = 'Container'
              basePrice = 4.99
            }
          }

          ingredientsList.push({
            id: ingredient.id,
            name: ingredient.name,
            nameClean: ingredient.nameClean || ingredient.name,
            description: ingredient.original || `${ingredient.name}`,
            unit: ingredient.unit || 'unit',
            aisle: ingredient.aisle || 'General',
            category,
            presentation,
            basePrice
          })
        }
      })
    }
  })

  console.log(`Extracted ${ingredientsList.length} unique ingredient(s)`)

  // Markets (from seed-markets.js)
  const markets = [
    { id: 1, name: 'Test Market' },
    { id: 2, name: 'Test Market 2' },
    { id: 3, name: 'Test Market 3' }
  ]

  const products = []
  let productId = 1
  let extIdCounter = 1001

  // Generate a product for each ingredient in each market
  ingredientsList.forEach((ingredient) => {
    const itemExtId = extIdCounter++

    markets.forEach((market) => {
      // Generate slightly different prices for each market
      const priceVariation = market.id === 2 ? 0.50 : (market.id === 3 ? -0.20 : 0)
      const price = (ingredient.basePrice + priceVariation).toFixed(2)

      // Generate unique barcode
      const barcode = `${itemExtId}${market.id}234567890${String(productId).padStart(3, '0')}`

      products.push({
        id: productId++,
        barcode,
        extid: itemExtId,
        name: ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1),
        description: ingredient.description,
        presentation: ingredient.presentation,
        unit: ingredient.unit,
        price: parseFloat(price),
        market_id: market.id,
        category: ingredient.category,
        user_id: 1
      })
    })
  })

  // Write products.json
  const productsJson = JSON.stringify(products, null, 2)
  fs.writeFile('./MockData/products.json', productsJson, (err) => {
    if (err) {
      console.error('Error writing products.json file:', err)
    } else {
      console.log(`\n✅ Products JSON file created successfully with ${products.length} products.`)
      console.log(`   - ${ingredientsList.length} unique ingredient(s)`)
      console.log(`   - ${markets.length} markets`)
      console.log(`   - Total: ${ingredientsList.length} × ${markets.length} = ${products.length} products`)
      console.log('File location: ./MockData/products.json')

      // Seed database after creating products.json
      seedProductsMockDatabase(products)
    }
  })
}

/**
 * Seed products into productsmock database table
 */
async function seedProductsMockDatabase(products) {
  console.log('\n-----------------------------------------')
  console.log('Seeding productsmock database table...\n')

  try {
    // Test database connection
    await db.sequelize.authenticate()
    console.log('✓ Database connection established')

    // Clear existing data
    const deletedCount = await db.ProductMock.destroy({ where: {}, truncate: true })
    console.log(`Cleared ${deletedCount} existing records from productsmock table`)

    // Prepare products for database insertion
    const productsForDB = products.map(product => ({
      barcode: product.barcode,
      idext: product.extid,
      name: product.name,
      presentation: product.presentation,
      unit: product.unit,
      amount: 0,
      price: product.price,
      total: 0,
      market_id: product.market_id,
      user_id: product.user_id
    }))

    console.log(`Inserting ${productsForDB.length} products...`)

    // Bulk insert products
    const result = await db.ProductMock.bulkCreate(productsForDB, {
      validate: true,
      returning: true
    })

    console.log(`✅ Successfully inserted ${result.length} products into productsmock table`)

    // Verify the count
    const count = await db.ProductMock.count()
    console.log(`✓ Verified: ${count} products in database`)

    // Show sample
    const sample = await db.ProductMock.findAll({ limit: 3 })
    console.log('\nSample products:')
    sample.forEach(p => {
      console.log(`  - ${p.name} ($${p.price}) at Market ${p.market_id}`)
    })

    // Close database connection
    await db.sequelize.close()
    console.log('\nDatabase connection closed')
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    console.error('Full error:', error)
    if (db.sequelize) {
      await db.sequelize.close()
    }
    process.exit(1)
  }
}

// Main execution
async function main() {
  try {
    await loopForIngredients(data)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()
