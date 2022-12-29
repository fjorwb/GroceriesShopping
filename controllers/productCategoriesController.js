const { ProductCategory } = require('../models')

module.exports = {
	async getAllCategories(req, res) {
		const categories = await ProductCategory.findAll()
			.then(category => {
				return res.status(200).json(category)
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async getCategoryById(req, res) {
		const category = await ProductCategory.findOne({
			where: {
				id: req.params.id
			}
		})
			.then(category => {
				return category
			})
			.catch(error => {
				return res.status(500).json(error)
			})

		if (!category) {
			return res.status(404).json({ message: 'category not found' })
		} else {
			return res.status(200).json(category)
		}
	},

	async createCategory(req, res) {
		const checkCategory = await ProductCategory.findOne({ where: { id: req.body.id } })

		if (checkCategory) {
			return res.status(400).json({ message: 'category already exists' })
		}

		const category = await Product.create(req.body)
			.then(category => {
				return res.status(201).send({ message: 'category created successfully', category })
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async updateCategory(req, res) {
		const checkCategory = await ProductCategory.findByPk(req.params.id)

		if (!checkCategory) {
			return res.status(404).json({ message: 'category not found' })
		}

		const category = await Product.update(req.body, { where: { id: req.params.id } })
			.then(category => {
				return res.status(200).send({ message: 'category updated successfully' })
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async deleteProduct(req, res) {
		const checkProduct = await Product.findByPk(req.params.id)

		if (!checkProduct) {
			return res.status(404).json({ message: 'category not found' })
		}

		const category = await Product.destroy({ where: { id: req.params.id } })
			.then(category => {
				return res.status(200).send({ message: 'category deleted successfully' })
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	}
}
