require('dotenv').config()
const fs = require('fs')
const axios = require('axios')

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
    }
  })
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
