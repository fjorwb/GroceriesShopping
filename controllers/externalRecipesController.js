const axios = require('axios')

const { Recipe } = require('../models/index')

module.exports = {
  async getRecipesFromApi(req, res) {
    try {
      const { recipe, cuisine } = req.query

      const options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
        params: { query: recipe, cuisine, number: '100' },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
        },
      }
      const response = await axios.request(options)
      return res.status(200).json({
        success: true,
        data: response.data.results
      })
    } catch (error) {
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

      const options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
        params: { includeNutrition: 'false' },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
        },
      }

      const response = await axios.request(options)
      const extendedIngredients = response.data.extendedIngredients || []
      const recipeData = response.data

      const ingredients = extendedIngredients.map((ing) => ({
        idext: ing.id,
        ingredient: ing.nameClean,
        amount: ing.amount,
        unit: ing.unit || 'unit',
      }))

      const recipe = {
        ingredients,
        servings: recipeData.servings,
        instructions: recipeData.instructions,
        title: recipeData.title,
        image: recipeData.image,
      }

      return res.status(200).json({
        success: true,
        data: recipe
      })
    } catch (error) {
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

      const options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
        params: { includeNutrition: 'false' },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
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
