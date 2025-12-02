const { ProductMock } = require('../models')

module.exports = {
  async getAllProductMocks(req, res) {
    try {
      const productmocks = await ProductMock.findAll()
      return res.status(200).json({
        success: true,
        data: productmocks
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch product mocks',
        error: error.message
      })
    }
  },
  async getProductMocksById(req, res) {
    try {
      const productmock = await ProductMock.findByPk(req.params.id)

      if (!productmock) {
        return res.status(404).json({
          success: false,
          message: 'Product mock not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: productmock
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch product mock',
        error: error.message
      })
    }
  },

  async createProductMocks(req, res) {
    try {
      const checkProductMock = await ProductMock.findOne({
        where: {
          idext: req.body.idext,
          market_id: req.body.market_id,
        },
      })

      if (checkProductMock) {
        return res.status(409).json({
          success: false,
          message: 'Product already exists'
        })
      }

      const createdProduct = await ProductMock.create(req.body)

      return res.status(201).json({
        success: true,
        data: createdProduct,
        message: 'Product created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create product mock',
        error: error.message
      })
    }
  },

  async updateProductMocks(req, res) {
    try {
      const productMockId = req.params.id

      const checkProductMock = await ProductMock.findByPk(productMockId)

      if (!checkProductMock) {
        return res.status(404).json({
          success: false,
          message: 'Product mock not found'
        })
      }

      await ProductMock.update(req.body, {
        where: {
          id: productMockId,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update product mock',
        error: error.message
      })
    }
  },
  async deleteProductMocks(req, res) {
    try {
      const productMockId = req.params.id

      const checkProductMock = await ProductMock.findByPk(productMockId)

      if (!checkProductMock) {
        return res.status(404).json({
          success: false,
          message: 'Product mock not found'
        })
      }

      await ProductMock.destroy({
        where: {
          id: productMockId,
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product mock',
        error: error.message
      })
    }
  },
  async deleteAllProductMocks(req, res) {
    try {
      await ProductMock.destroy({
        where: {},
        truncate: true,
      })

      return res.status(200).json({
        success: true,
        message: 'All products deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete all product mocks',
        error: error.message
      })
    }
  },
}
