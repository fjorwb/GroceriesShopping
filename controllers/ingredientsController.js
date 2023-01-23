const {Ingredient} = require('../models/index')

module.exports = {
	async getAllIngredients(req, res) {
		const ingredients = await Ingredient.findAll({
			where: {
				user_id: req.user.id
			}
		})
			.then((ingredients) => {
				res.status(200).json(ingredients)
			})
			.catch((err) => {
				res.status(500).json(err)
			})
	},

	async getIngredientById(req, res) {
		const ingredient = await Ingredient.findOne({
			where: {
				id: req.params.id
			}
		})
			.then((ingredient) => {
				return ingredient
			})
			.catch((err) => {
				return res.status(500).send({message: err.message})
			})

		if (!ingredient) {
			return res.status(404).send({message: 'ingredient not found'})
		} else {
			return res.status(200).send(ingredient)
		}
	},

	async createIngredient(req, res) {
		const checkIngredient = await Ingredient.findOne({where: {idext: req.body.idext}})
			.then((ingredient) => {
				return ingredient
			})
			.catch((err) => {
				return res.status(500).json(err)
			})

		if (checkIngredient) {
			return res.status(400).json({message: 'ingredient already exists'})
		}

		const ingredient = await Ingredient.create(req.body)
			.then((ingredient) => {
				return res.status(201).json({message: 'ingredient successfully created'})
			})
			.catch((err) => {
				return res.status(500).json({message: err.message})
			})
	},

	async updateIngredient(req, res) {
		const checkIngredient = await Ingredient.findByPk(req.params.id)
			.then((ingredient) => {
				return ingredient
			})
			.catch((err) => {
				return res.status(500).json(err)
			})

		if (!checkIngredient) {
			return res.status(400).json({message: 'ingredient does not exist'})
		}

		const ingredient = await Ingredient.update(req.body, {where: {id: req.params.id}})
			.then((ingredient) => {
				return res.status(200).json({message: 'ingredient succesfully updated'})
			})
			.catch((err) => {
				return res.status(500).json(err)
			})
	},

	async deleteIngredient(req, res) {
		const checkIngredient = await Ingredient.findByPk(req.params.id)
			.then((ingredient) => {
				return ingredient
			})
			.catch((err) => {
				return res.status(500).json(err)
			})

		if (!checkIngredient) {
			return res.status(400).json({message: 'ingredient does not exist'})
		}

		const ingredient = await Ingredient.destroy({where: {id: req.params.id}})
			.then((ingredient) => {
				return res.status(200).send({message: 'ingredient succesfully deleted'})
			})
			.catch((err) => {
				return res.status(500).json(err)
			})
	}
}
