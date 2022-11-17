const { ShoppingList } = require('../models')

module.exports = {
	async getAllShoppingLists(req, res) {
		await ShoppingList.findAll()
			.then(shoppingLists => {
				return res.status(200).json(shoppingLists)
			})
			.catch(error => {
				return res.status(500).json(error)
			})
	},

	async getShoppingListById(req, res) {
		const shoppinglist = await ShoppingList.findByPk(req.params.id)
			.then(shoppinglist => {
				return res.status(200).json(shoppinglist)
			})
			.catch(err => {
				return res.status(500).json(err)
			})
	},

	async createShoppingList(req, res) {
		const checkShoppingList = await ShoppingList.findOne({
			where: {
				barcode: req.body.barcode
			}
		})

		if (checkShoppingList) {
			return res.status(500).json({ message: 'shoppingList already exists' })
		}

		const shoppinglist = await ShoppingList.create(req.body)
			.then(shoppinglist => {
				return res.status(201).send({ message: 'shoppingList created successfully', shoppinglist })
			})
			.catch(err => {
				return res.status(500).json(err)
			})
	},

	async updateShoppingList(req, res) {
		console.log(req.params.id)

		const checkShoppingList = await ShoppingList.findOne({
			where: {
				id: req.params.id
			}
		})

		console.log(!checkShoppingList)

		if (!checkShoppingList) {
			return res.status(500).json({ message: 'shoppingList not found' })
		}

		const shoppinglist = await ShoppingList.update(req.body, {
			where: {
				id: req.params.id
			}
		})
			.then(shoppinglist => {
				res.status(200).send({ message: 'shoppingList updated successfully' })
			})
			.catch(err => {
				res.status(500).json(err)
			})
	},

	async deleteShoppingList(req, res) {
		const checkShoppingList = await ShoppingList.findByPk(req.params.id)

		if (!checkShoppingList) {
			return res.status(404).json({ message: 'shoppingList not found' })
		}

		const shoppinglist = await ShoppingList.destroy({
			where: {
				id: req.params.id
			}
		})
			.then(shoppinglist => {
				res.status(200).send({ message: 'shoppingList deleted successfully' })
			})
			.catch(err => {
				res.status(500).json(err)
			})
	}
}
