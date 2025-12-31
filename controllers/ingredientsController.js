const { Ingredient } = require('../models/index')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllIngredients(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 10, maxLimit: 100 })

      const result = await Ingredient.findAndCountAll({
        where: {
          user_id: req.user.id
        },
        order: [['id', 'DESC']],
        limit,
        offset
      })
      console.log(result)

      return res.status(200).json(formatPaginatedResponse(result, { page, limit, offset }))
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch ingredients',
        error: error.message
      })
    }
  },

  async getIngredientById(req, res) {
    try {
      const ingredient = await Ingredient.findOne({
        where: {
          idext: req.params.id,
          user_id: req.user.id
        }
      })

      if (!ingredient) {
        return res.status(404).json({
          success: false,
          message: 'Ingredient not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: ingredient
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch ingredient',
        error: error.message
      })
    }
  },

  async createIngredient(req, res) {
    try {
      const checkIngredient = await Ingredient.findOne({
        where: {
          idext: req.body.idext,
          user_id: req.user.id
        }
      })

      if (checkIngredient) {
        return res.status(409).json({
          success: false,
          message: 'Ingredient already exists'
        })
      }

      console.log(req.body)

      const ingredient = await Ingredient.create({
        ...req.body,
        user_id: req.user.id
      })

      return res.status(201).json({
        success: true,
        data: ingredient,
        message: 'Ingredient successfully created'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create ingredient',
        error: error.message
      })
    }
  },

  async updateIngredient(req, res) {
    try {
      const ingredientId = req.params.id

      const checkIngredient = await Ingredient.findOne({
        where: {
          id: ingredientId,
          user_id: req.user.id
        }
      })

      if (!checkIngredient) {
        return res.status(404).json({
          success: false,
          message: 'Ingredient not found'
        })
      }

      await Ingredient.update(req.body, {
        where: {
          id: ingredientId,
          user_id: req.user.id
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Ingredient successfully updated'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update ingredient',
        error: error.message
      })
    }
  },

  async deleteIngredient(req, res) {
    try {
      const ingredientId = req.params.id

      const checkIngredient = await Ingredient.findOne({
        where: {
          idext: ingredientId,
          user_id: req.user.id
        }
      })

      if (!checkIngredient) {
        return res.status(404).json({
          success: false,
          message: 'Ingredient not found'
        })
      }

      await Ingredient.destroy({
        where: {
          idext: ingredientId,
          user_id: req.user.id
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Ingredient successfully deleted'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete ingredient',
        error: error.message
      })
    }
  }
}
