const axios = require('axios')

const { Recipe } = require('../models/index')

module.exports = {
  async getRecipesFromApi(req, res) {
    try {
      const { recipe, cuisine, number = '50' } = req.query

      // Validate API credentials
      const apiKey = process.env.RAPIDAPI_KEY?.replace(/^['"]|['"]$/g, '') // Remove quotes if present
      const apiHost = process.env.RAPIDAPI_HOST?.replace(/^['"]|['"]$/g, '') // Remove quotes if present

      if (!apiKey || !apiHost) {
        return res.status(500).json({
          success: false,
          message: 'API configuration error: RAPIDAPI_KEY and RAPIDAPI_HOST must be set in environment variables'
        })
      }

      // Validate required query parameter
      if (!recipe) {
        return res.status(400).json({
          success: false,
          message: 'Missing required query parameter: recipe'
        })
      }

      // Step 1: Call complexSearch to get recipe IDs
      const searchOptions = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
        params: {
          query: recipe,
          ...(cuisine && { cuisine }), // Only include cuisine if provided
          number: number.toString()
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      }

      const searchResponse = await axios.request(searchOptions)

      // Check if results exist
      if (!searchResponse.data || !searchResponse.data.results || searchResponse.data.results.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: 'No recipes found'
        })
      }

      // Step 2: Extract recipe IDs from search results
      const recipeIds = searchResponse.data.results.map(recipe => recipe.id)

      // Step 3: Call informationBulk to get full recipe details
      const bulkOptions = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk',
        params: {
          ids: recipeIds.join(','), // Comma-separated recipe IDs
          includeNutrition: 'false'
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      }

      const bulkResponse = await axios.request(bulkOptions)

      // Step 4: Normalize and transform the data
      const normalizedRecipes = (bulkResponse.data || []).map(recipeData => {
        // Normalize ingredients from extendedIngredients
        const ingredients = (recipeData.extendedIngredients || []).map(ing => ({
          ingredient: ing.nameClean || ing.name || ing.originalName || '',
          amount: ing.amount?.toString() || '1',
          unit: ing.unit || ing.unitShort || ''
        }))

        // Normalize instructions from analyzedInstructions
        let instructions = ''
        if (recipeData.analyzedInstructions && recipeData.analyzedInstructions.length > 0) {
          // Flatten steps from all instruction sections
          const allSteps = recipeData.analyzedInstructions.flatMap(section =>
            (section.steps || []).map(step => step.step)
          )
          instructions = allSteps.join(' ')
        } else if (recipeData.instructions) {
          // Fallback to plain instructions if available
          instructions = recipeData.instructions
        }

        // Normalize servings (use yield or servings)
        const servings = recipeData.servings || recipeData.yield || 1

        return {
          id: recipeData.id,
          title: recipeData.title || '',
          image: recipeData.image || '',
          servings,
          instructions,
          ingredients
        }
      })

      return res.status(200).json({
        success: true,
        data: normalizedRecipes
      })
    } catch (error) {
      // Handle axios errors with more detail
      if (error.response) {
        // API responded with error status
        const statusCode = error.response.status
        const errorMessage = error.response.data?.message || error.message

        // Map common API errors to appropriate HTTP status codes
        if (statusCode === 401 || statusCode === 403) {
          return res.status(401).json({
            success: false,
            message: 'API authentication failed. Please check your RAPIDAPI_KEY.',
            error: errorMessage
          })
        }

        if (statusCode === 429) {
          return res.status(429).json({
            success: false,
            message: 'API rate limit exceeded. Please try again later.',
            error: errorMessage
          })
        }

        return res.status(statusCode).json({
          success: false,
          message: 'Failed to fetch recipes from API',
          error: errorMessage
        })
      }

      // Network or other errors
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recipes from API',
        error: error.message
      })
    }
  },

  async getRecipeFromApi(req, res) {
    try {
      const idext = req.params.id

      if (!idext) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        })
      }

      // Validate API credentials
      const apiKey = process.env.RAPIDAPI_KEY?.replace(/^['"]|['"]$/g, '')
      const apiHost = process.env.RAPIDAPI_HOST?.replace(/^['"]|['"]$/g, '')

      if (!apiKey || !apiHost) {
        return res.status(500).json({
          success: false,
          message: 'API configuration error: RAPIDAPI_KEY and RAPIDAPI_HOST must be set in environment variables'
        })
      }

      const options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
        params: { includeNutrition: 'false' },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      }

      const response = await axios.request(options)
      const recipeData = response.data

      // Normalize ingredients from extendedIngredients (same format as bulk endpoint)
      const ingredients = (recipeData.extendedIngredients || []).map(ing => ({
        ingredient: ing.nameClean || ing.name || ing.originalName || '',
        amount: ing.amount?.toString() || '1',
        unit: ing.unit || ing.unitShort || ''
      }))

      // Normalize instructions from analyzedInstructions
      let instructions = ''
      if (recipeData.analyzedInstructions && recipeData.analyzedInstructions.length > 0) {
        // Flatten steps from all instruction sections
        const allSteps = recipeData.analyzedInstructions.flatMap(section =>
          (section.steps || []).map(step => step.step)
        )
        instructions = allSteps.join(' ')
      } else if (recipeData.instructions) {
        // Fallback to plain instructions if available
        instructions = recipeData.instructions
      }

      // Normalize servings (use yield or servings)
      const servings = recipeData.servings || recipeData.yield || 1

      // Return normalized recipe object (same structure as bulk endpoint)
      const recipe = {
        id: recipeData.id,
        title: recipeData.title || '',
        image: recipeData.image || '',
        servings,
        instructions,
        ingredients
      }

      return res.status(200).json({
        success: true,
        data: recipe
      })
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status
        const errorMessage = error.response.data?.message || error.message

        if (statusCode === 401 || statusCode === 403) {
          return res.status(401).json({
            success: false,
            message: 'API authentication failed. Please check your RAPIDAPI_KEY.',
            error: errorMessage
          })
        }

        if (statusCode === 404) {
          return res.status(404).json({
            success: false,
            message: 'Recipe not found',
            error: errorMessage
          })
        }

        return res.status(statusCode).json({
          success: false,
          message: 'Failed to fetch recipe from API',
          error: errorMessage
        })
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recipe from API',
        error: error.message
      })
    }
  },

  async createExternalRecipe(req, res) {
    try {
      const idext = req.params.id
      const userId = req.user?.id

      if (!idext) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        })
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      const checkRecipe = await Recipe.findOne({
        where: { idext, user_id: userId },
      })

      if (checkRecipe) {
        return res.status(409).json({
          success: false,
          message: 'Recipe already exists'
        })
      }

      // Validate API credentials
      const apiKey = process.env.RAPIDAPI_KEY?.replace(/^['"]|['"]$/g, '')
      const apiHost = process.env.RAPIDAPI_HOST?.replace(/^['"]|['"]$/g, '')

      if (!apiKey || !apiHost) {
        return res.status(500).json({
          success: false,
          message: 'API configuration error: RAPIDAPI_KEY and RAPIDAPI_HOST must be set in environment variables'
        })
      }

      const options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
        params: { includeNutrition: 'false' },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      }

      const apiResponse = await axios.request(options)
      const { id, title, image, servings, instructions } = apiResponse.data

      const recipe = await Recipe.create({
        idext: id,
        title,
        image,
        servings,
        instructions,
        user_id: userId,
      })

      return res.status(201).json({
        success: true,
        data: recipe,
        message: 'Recipe created successfully'
      })
    } catch (error) {
      if (error.response) {
        return res.status(400).json({
          success: false,
          message: 'Failed to fetch recipe from external API',
          error: error.message
        })
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create recipe',
        error: error.message
      })
    }
  },

  async updateExternalRecipe(req, res) {
    try {
      const recipeId = req.params.id
      const userId = req.user?.id

      if (!recipeId) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        })
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      const checkRecipe = await Recipe.findOne({
        where: { id: recipeId, user_id: userId },
      })

      if (!checkRecipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        })
      }

      await Recipe.update(req.body, {
        where: {
          id: recipeId,
          user_id: userId,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Recipe successfully updated'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update recipe',
        error: error.message
      })
    }
  },

  async deleteExternalRecipe(req, res) {
    try {
      const recipeId = req.params.id
      const userId = req.user?.id

      if (!recipeId) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        })
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      const checkRecipe = await Recipe.findOne({
        where: { id: recipeId, user_id: userId },
      })

      if (!checkRecipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        })
      }

      await Recipe.destroy({
        where: {
          id: recipeId,
          user_id: userId,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Recipe successfully deleted'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete recipe',
        error: error.message
      })
    }
  },
}
