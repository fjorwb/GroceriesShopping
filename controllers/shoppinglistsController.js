const { ShoppingList } = require('../models')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllShoppingLists(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 10, maxLimit: 100 })

      const result = await ShoppingList.findAndCountAll({
        where: {
          user_id: req.user.id,
        },
        order: [['id', 'DESC']],
        limit,
        offset
      })

      return res.status(200).json(formatPaginatedResponse(result, { page, limit, offset }))
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch shopping lists',
        error: error.message
      })
    }
  },

  async getShoppingListById(req, res) {
    try {
      const shoppinglist = await ShoppingList.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      })

      if (!shoppinglist) {
        return res.status(404).json({
          success: false,
          message: 'Shopping list not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: shoppinglist
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch shopping list',
        error: error.message
      })
    }
  },

  async getShoppingListByShopListId(req, res) {
    try {
      const shoppinglist = await ShoppingList.findOne({
        where: {
          shop_list_id: req.params.id,
          user_id: req.user.id,
        },
      })

      if (!shoppinglist) {
        return res.status(404).json({
          success: false,
          message: 'Shopping list not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: shoppinglist
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch shopping list',
        error: error.message
      })
    }
  },

  async createShoppingList(req, res) {
    try {
      const checkShoppingList = await ShoppingList.findOne({
        where: {
          shop_list_id: req.body.shop_list_id,
          user_id: req.user.id,
        },
      })

      if (checkShoppingList) {
        return res.status(409).json({
          success: false,
          message: 'Shopping list already exists'
        })
      }

      const shoppingList = await ShoppingList.create({
        ...req.body,
        user_id: req.user.id,
      })

      return res.status(201).json({
        success: true,
        data: shoppingList,
        message: 'Shopping list created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create shopping list',
        error: error.message
      })
    }
  },

  async updateShoppingList(req, res) {
    try {
      const shoppingListId = req.params.id

      const checkShoppingList = await ShoppingList.findOne({
        where: {
          id: shoppingListId,
          user_id: req.user.id,
        },
      })

      if (!checkShoppingList) {
        return res.status(404).json({
          success: false,
          message: 'Shopping list not found'
        })
      }

      await ShoppingList.update(req.body, {
        where: {
          id: shoppingListId,
          user_id: req.user.id,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Shopping list updated successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update shopping list',
        error: error.message
      })
    }
  },

  async deleteShoppingList(req, res) {
    try {
      const shoppingListId = req.params.id

      const checkShoppingList = await ShoppingList.findOne({
        where: {
          id: shoppingListId,
          user_id: req.user.id,
        },
      })

      if (!checkShoppingList) {
        return res.status(404).json({
          success: false,
          message: 'Shopping list not found'
        })
      }

      await ShoppingList.destroy({
        where: {
          id: shoppingListId,
          user_id: req.user.id,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Shopping list deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete shopping list',
        error: error.message
      })
    }
  },

  async deleteShoppingListByShopListId(req, res) {
    try {
      const shopListId = req.params.id

      const checkShoppingList = await ShoppingList.findOne({
        where: {
          shop_list_id: shopListId,
          user_id: req.user.id,
        },
      })

      if (!checkShoppingList) {
        return res.status(404).json({
          success: false,
          message: 'Shopping list not found'
        })
      }

      await ShoppingList.destroy({
        where: {
          shop_list_id: shopListId,
          user_id: req.user.id,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Shopping list deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete shopping list',
        error: error.message
      })
    }
  },
}
