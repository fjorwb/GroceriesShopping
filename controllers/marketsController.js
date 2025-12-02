const { Market } = require('../models')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllMarkets(req, res) {
    try {
      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 10, maxLimit: 100 })

      const result = await Market.findAndCountAll({
        order: [['id', 'DESC']],
        limit,
        offset
      })

      return res.status(200).json(formatPaginatedResponse(result, { page, limit, offset }))
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch markets',
        error: error.message
      })
    }
  },

  async getMarketById(req, res) {
    try {
      const market = await Market.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!market) {
        return res.status(404).json({
          success: false,
          message: 'Market not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: market
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch market',
        error: error.message
      })
    }
  },

  async createMarket(req, res) {
    try {
      const checkMarket = await Market.findOne({
        where: { email: req.body.email }
      })

      if (checkMarket) {
        return res.status(409).json({
          success: false,
          message: 'Market already exists'
        })
      }

      const market = await Market.create(req.body)

      return res.status(201).json({
        success: true,
        data: market,
        message: 'Market created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create market',
        error: error.message
      })
    }
  },

  async updateMarket(req, res) {
    try {
      const marketId = req.params.id

      const checkMarket = await Market.findOne({
        where: { id: marketId }
      })

      if (!checkMarket) {
        return res.status(404).json({
          success: false,
          message: 'Market not found'
        })
      }

      await Market.update(req.body, {
        where: { id: marketId }
      })

      return res.status(200).json({
        success: true,
        message: 'Market successfully updated'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update market',
        error: error.message
      })
    }
  },

  async deleteMarket(req, res) {
    try {
      const marketId = req.params.id

      const checkMarket = await Market.findOne({
        where: { id: marketId }
      })

      if (!checkMarket) {
        return res.status(404).json({
          success: false,
          message: 'Market not found'
        })
      }

      await Market.destroy({
        where: { id: marketId }
      })

      return res.status(200).json({
        success: true,
        message: 'Market successfully deleted'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete market',
        error: error.message
      })
    }
  }
}
