const { Menu } = require('../models')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllMenus(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 10, maxLimit: 100 })

      const result = await Menu.findAndCountAll({
        where: {
          user_id: req.user.id
        },
        order: [['id', 'DESC']],
        limit,
        offset
      })

      return res.status(200).json(formatPaginatedResponse(result, { page, limit, offset }))
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch menus',
        error: error.message
      })
    }
  },

  async getMenuById(req, res) {
    try {
      const menu = await Menu.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id
        }
      })

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Menu not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: menu
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch menu',
        error: error.message
      })
    }
  },

  async createMenu(req, res) {
    try {
      const menu = await Menu.create({
        ...req.body,
        user_id: req.user.id
      })

      return res.status(201).json({
        success: true,
        data: menu,
        message: 'Meal created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create menu',
        error: error.message
      })
    }
  },

  async updateMenu(req, res) {
    try {
      const menuId = req.params.id

      const checkMenu = await Menu.findOne({
        where: {
          id: menuId,
          user_id: req.user.id
        }
      })

      if (!checkMenu) {
        return res.status(404).json({
          success: false,
          message: 'Menu not found'
        })
      }

      await Menu.update(req.body, {
        where: {
          id: menuId,
          user_id: req.user.id
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Meal updated successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update menu',
        error: error.message
      })
    }
  },

  async deleteMenu(req, res) {
    try {
      const menuId = req.params.id

      const checkMenu = await Menu.findOne({
        where: {
          id: menuId,
          user_id: req.user.id
        }
      })

      if (!checkMenu) {
        return res.status(404).json({
          success: false,
          message: 'Menu not found'
        })
      }

      await Menu.destroy({
        where: {
          id: menuId,
          user_id: req.user.id
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Meal deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete menu',
        error: error.message
      })
    }
  }
}
