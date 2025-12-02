const { Recipe } = require('../models/index')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllRecipes(req, res) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 10, maxLimit: 100 })

      const result = await Recipe.findAndCountAll({
        where: {
          user_id: userId,
        },
        order: [['id', 'DESC']],
        limit,
        offset
      })

      return res.status(200).json(formatPaginatedResponse(result, { page, limit, offset }))
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recipes',
        error: error.message
      })
    }
  },

  async getRecipeById(req, res) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      const recipeId = req.params.id

      if (!recipeId) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        })
      }

      const recipe = await Recipe.findOne({
        where: {
          id: recipeId,
          user_id: userId,
        },
      })

      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: recipe
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recipe',
        error: error.message
      })
    }
  },

  async createRecipe(req, res) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      // Only check for existing recipe if idext is provided
      let checkRecipe = null
      if (req.body.idext) {
        checkRecipe = await Recipe.findOne({
          where: {
            idext: req.body.idext,
            user_id: userId,
          },
        })
      }

      if (checkRecipe) {
        return res.status(409).json({
          success: false,
          message: 'Recipe already exists'
        })
      }

      const recipe = await Recipe.create({
        ...req.body,
        user_id: userId,
      })

      return res.status(201).json({
        success: true,
        data: recipe,
        message: 'Recipe successfully created'
      })
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError' || (error.errors && Array.isArray(error.errors))) {
        const errors = error.errors ? error.errors.map(e => ({
          field: e.path || e.field,
          message: e.message,
          value: e.value
        })) : [{ message: error.message }]
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        })
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Recipe already exists',
          error: error.errors?.[0]?.message || error.message
        })
      }
      // Log error for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.error('Recipe creation error:', error.name, error.message)
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create recipe',
        error: error.message
      })
    }
  },

  async updateRecipe(req, res) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      const recipeId = req.params.id

      if (!recipeId) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        })
      }

      const checkRecipe = await Recipe.findOne({
        where: {
          id: recipeId,
          user_id: userId,
        },
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

      // Fetch updated recipe data
      const updatedRecipe = await Recipe.findByPk(recipeId)

      return res.status(200).json({
        success: true,
        data: updatedRecipe,
        message: 'Recipe successfully updated'
      })
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        })
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Recipe already exists',
          error: error.errors?.[0]?.message || error.message
        })
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to update recipe',
        error: error.message
      })
    }
  },

  async deleteRecipe(req, res) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      const recipeId = req.params.id

      if (!recipeId) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required'
        })
      }

      const checkRecipe = await Recipe.findOne({
        where: {
          id: recipeId,
          user_id: userId,
        },
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
