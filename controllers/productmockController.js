const { ProductMock } = require('../models')

module.exports = {
  async getAllProductMocks(req, res) {
    const productmocks = await ProductMock.findAll()
      .then((productmocks) => {
        return res.status(200).json(productmocks)
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  },
  async getProductMocksById(req, res) {
    await ProductMock.findByPk(req.params.id)
      .then((productmock) => {
        return res.status(200).json(productmock)
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  },
  async createProductMocks(req, res) {
    const checkProductMock = await ProductMock.findOne({
      where: {
        idext: req.body.idext,
        market_id: req.body.market_id
      }
    })

    if (checkProductMock) {
      return res.status(400).json({ message: 'product already exists' })
    }

    await ProductMock.create(req.body)
      .then((productmock) => {
        return res
          .status(201)
          .send({ message: 'product created successfully', productmock })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  },
  async updateProductMocks(req, res) {
    const checkProductMock = await ProductMock.findByPk(req.params.id)

    if (!checkProductMock) {
      return res.status(404).json({ message: 'product not found' })
    }

    await ProductMock.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then((productmock) => {
        return res
          .status(200)
          .json({ message: 'product updated successfully', productmock })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  },
  async deleteProductMocks(req, res) {
    const checkProductMock = await ProductMock.findByPk(req.params.id)

    if (!checkProductMock) {
      return res.status(404).json({ message: 'product not found' })
    }

    await ProductMock.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((productmock) => {
        return res
          .status(200)
          .json({ message: 'product deleted successfully', productmock })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  },
  async deleteAllProductMocks(req, res) {
    await ProductMock.destroy({
      where: {},
      truncate: true
    })
      .then((productmock) => {
        return res
          .status(200)
          .json({ message: 'products deleted successfully', productmock })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  }
}
