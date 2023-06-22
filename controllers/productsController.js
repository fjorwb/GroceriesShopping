const { Product } = require('../models')

module.exports = {
  async getAllProducts(req, res) {
    const products = await Product.findAll({
      where: {
        user_id: req.user.id
      }
    })
      .then((products) => {
        return res.status(200).json(products)
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  },

  async getProductById(req, res) {
    const product = await Product.findOne({
      where: {
        id: req.params.id
      }
    })
      .then((product) => {
        return product
      })
      .catch((error) => {
        return res.status(500).json(error)
      })

    if (!product) {
      return res.status(404).json({ message: 'product not found' })
    } else {
      return res.status(200).json(product)
    }
  },

  async getProductByExtId(req, res) {
    console.log('req.params', req.params)

    const product = await Product.findOne({
      where: {
        extid: req.params.extid
      }
    })
      .then((product) => {
        return product
      })
      .catch((error) => {
        return res.status(500).json(error)
      })

    return product
      ? res.status(200).json(product)
      : res.status(404).json({ message: 'product not found' })
  },

  async createProduct(req, res) {
    console.log('req.body', req.body)

    const checkProduct = await Product.findOne({
      where: {
        extid: req.body.extid
        // presentation: req.body.presentation,
        // name: req.body.name
      }
    })
      .then((product) => {
        return product
      })
      .catch((error) => {
        return res.status(500).json({ message: error.message })
      })

    if (checkProduct) {
      console.log('product already exists')
      return res.status(400).json({ message: 'product already exists' })
    }

    await Product.create(req.body)
      .then((res) => {
        res
          .status(201)
          .send({ data: res.data, message: 'product created successfully' })
      })
      .catch((error) => {
        res.send(500).json(error)
      })
  },

  async updateProduct(req, res) {
    const checkProduct = await Product.findByPk(req.params.id)

    if (!checkProduct) {
      return res.status(404).json({ message: 'product not found' })
    }

    await Product.update(req.body, {
      where: { id: req.params.id }
    })
      .then((product) => {
        return res
          .status(200)
          .send({ message: 'product updated successfully', product })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
  },

  async deleteProduct(req, res) {
    const checkProduct = await Product.findByPk(req.params.id)

    if (!checkProduct) {
      return res.status(404).json({ message: 'product not found' })
    }

    const product = await Product.destroy({ where: { id: req.params.id } })
      .then((product) => {
        return res.status(200).send({ message: 'product deleted successfully' })
      })
      .catch((error) => {
        return res.status(500).json(error)
      })
    return product
  }
}
