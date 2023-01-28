const {Menu} = require('../models')

module.exports = {
	async getAllMenus(req, res) {
		console.log('REQ USER ID', req.user.id)
		const menus = await Menu.findAll({
			where: {
				user_id: req.user.id
			}
		})
			.then((menus) => {
				res.status(200).json(menus)
			})
			.catch((err) => {
				res.status(500).json(err)
			})
	},

	async getMenuById(req, res) {
		const menu = await Menu.findOne({
			where: {
				id: req.params.id
			}
		})

		if (!menu) {
			return res.status(404).send({message: 'Menu not found'})
		} else {
			return res.status(200).send(menu)
		}
	},

	async createMenu(req, res) {
		const menu = await Menu.create(req.body)
			.then((menu) => {
				res.status(201).send({message: 'meal created successfully', menu})
			})
			.catch((err) => {
				res.status(500).json(err)
			})
	},

	async updateMenu(req, res) {
		// console.log(req.params.id)

		const checkMenu = await Menu.findOne({where: {id: req.params.id}})
			.then((menu) => {
				return menu
			})
			.catch((err) => {
				res.status(500).json(err)
			})

		// console.log(checkMenu)

		if (!checkMenu) {
			return res.status(400).json({message: 'meal not found'})
		}

		const menu = await Menu.update(req.body, {where: {id: req.params.id}})
			.then((menu) => {
				res.status(200).send({message: 'meal updated successfully'})
			})
			.catch((err) => {
				res.status(500).json(err)
			})
	},

	async deleteMenu(req, res) {
		const checkMenu = await Menu.findByPk(req.params.id)
			.then((menu) => {
				return menu
			})
			.catch((err) => {
				res.status(500).json(err)
			})

		if (!checkMenu) {
			return res.status(400).json({message: 'meal does not exist'})
		}

		const menu = await Menu.destroy({where: {id: req.params.id}})
			.then((menu) => {
				res.status(200).send({message: 'meal deleted successfully', menu})
			})
			.catch((err) => {
				res.status(500).json(err)
			})
	}
}
