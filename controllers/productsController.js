const { Product } = require('../models')

module.exports = {
	async getAllProducts(req, res) {
		const products = await Product.findAll()
			.then(products => {
				return res.status(200).json(products)
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async getProductById(req, res) {
		const product = await Product.findByPk(req.params.id)
			.then(product => {
				return res.status(200).json(product)
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async createProduct(req, res) {
		const checkProduct = await Product.findOne({ where: { barcode: req.body.barcode } })

		if (checkProduct) {
			return res.status(400).json({ message: 'product already exists' })
		}

		const product = await Product.create(req.body)
			.then(product => {
				return res.status(201).send({ message: 'product created successfully', product })
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async updateProduct(req, res) {
		const checkProduct = await Product.findByPk(req.params.id)

		if (!checkProduct) {
			return res.status(404).json({ message: 'product not found' })
		}

		const product = await Product.update(req.body, { where: { id: req.params.id } })
			.then(product => {
				return res.status(200).send({ message: 'product updated successfully' })
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async deleteProduct(req, res) {
		const checkProduct = await Product.findByPk(req.params.id)

		if (!checkProduct) {
			return res.status(404).json({ message: 'product not found' })
		}

		const product = await Product.destroy({ where: { id: req.params.id } })
			.then(product => {
				return res.status(200).send({ message: 'product deleted successfully' })
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	}
}
