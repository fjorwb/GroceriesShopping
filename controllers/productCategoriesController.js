const { ProductCategory } = require('../models')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllCategories(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 20, maxLimit: 100 })

      const result = await ProductCategory.findAndCountAll({
        order: [['id', 'ASC']],
        limit,
        offset
      })

      return res.status(200).json(formatPaginatedResponse(result, { page, limit, offset }))
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      })
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await ProductCategory.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: category
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch category',
        error: error.message
      })
    }
  },

  async createCategory(req, res) {
    try {
      const category = await ProductCategory.create(req.body)

      return res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message
      })
    }
  },

  async updateCategory(req, res) {
    try {
      const categoryId = req.params.id

      const checkCategory = await ProductCategory.findByPk(categoryId)

      if (!checkCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        })
      }

      await ProductCategory.update(req.body, {
        where: { id: categoryId }
      })

      return res.status(200).json({
        success: true,
        message: 'Category updated successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error.message
      })
    }
  },

  async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id

      const checkCategory = await ProductCategory.findByPk(categoryId)

      if (!checkCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        })
      }

      await ProductCategory.destroy({
        where: { id: categoryId }
      })

      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error.message
      })
    }
  }
}
