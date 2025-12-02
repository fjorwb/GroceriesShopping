const { Product } = require('../models')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllProducts(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 10, maxLimit: 100 })

      const result = await Product.findAndCountAll({
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
        message: 'Failed to fetch products',
        error: error.message
      })
    }
  },

  async getProductById(req, res) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id
        }
      })

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: product
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      })
    }
  },

  async getProductByExtId(req, res) {
    try {
      const product = await Product.findOne({
        where: {
          extid: req.params.extid,
          user_id: req.user.id
        }
      })

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: product
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      })
    }
  },

  async createProduct(req, res) {
    try {
      // Only check for existing product if extid is provided
      let checkProduct = null
      if (req.body.extid) {
        checkProduct = await Product.findOne({
          where: {
            extid: req.body.extid,
            user_id: req.user.id
          }
        })
      }

      if (checkProduct) {
        return res.status(409).json({
          success: false,
          message: 'Product already exists'
        })
      }

      const product = await Product.create({
        ...req.body,
        user_id: req.user.id
      })

      return res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
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
          message: 'Product already exists',
          error: error.errors?.[0]?.message || error.message
        })
      }
      // Log error for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.error('Product creation error:', error.name, error.message)
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message
      })
    }
  },

  async updateProduct(req, res) {
    try {
      const productId = req.params.id

      const checkProduct = await Product.findOne({
        where: {
          id: productId,
          user_id: req.user.id
        }
      })

      if (!checkProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      await Product.update(req.body, {
        where: {
          id: productId,
          user_id: req.user.id
        }
      })

      // Fetch updated product data
      const updatedProduct = await Product.findByPk(productId)

      return res.status(200).json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
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
          message: 'Product already exists',
          error: error.errors?.[0]?.message || error.message
        })
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      })
    }
  },

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id

      const checkProduct = await Product.findOne({
        where: {
          id: productId,
          user_id: req.user.id
        }
      })

      if (!checkProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      await Product.destroy({
        where: {
          id: productId,
          user_id: req.user.id
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      })
    }
  }
}
