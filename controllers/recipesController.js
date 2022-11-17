const axios = require('axios')

const { Recipe } = require('../models/index')

module.exports = {
	async getAllRecipes(req, res) {
		const recipes = await Recipe.findAll({})
			.then(recipes => {
				res.status(200).send(recipes)
			})
			.catch(err => {
				res.status(400).send({ message: err.message })
			})
	},

	async getRecipeById(req, res) {
		const recipe = await Recipe.findOne({
			where: {
				id: req.params.id
			}
		})
			.then(recipe => {
				res.status(200).send(recipe)
			})
			.catch(err => {
				res.status(400).send({ message: err.message })
			})
	},

	async createRecipe(req, res) {
		const recipe = await Recipe.create(req.body)
			.then(recipe => {
				res.status(200).send(recipe)
			})
			.catch(err => {
				res.status(400).send({ message: err.message })
			})
	},

	async updateRecipe(req, res) {
		const checkRecipe = await Recipe.findOne({
			where: { id: req.params.id }
		})

		if (!checkRecipe) {
			return res.status(400).send({ message: 'recipe not found' })
		}

		const recipe = await Recipe.update(req.body, {
			where: {
				id: req.params.id
			}
		})
			.then(recipe => {
				res.status(200).send({ message: 'recipe successfully updated' })
			})
			.catch(err => {
				res.status(400).send({ message: err.message })
			})
	},

	async deleteRecipe(req, res) {
		const checkRecipe = await Recipe.findOne({
			where: {
				id: req.params.id
			}
		})

		if (!checkRecipe) {
			return res.status(400).send({ message: 'recipe not found' })
		}

		const recipe = await Recipe.destroy({
			where: {
				id: req.params.id
			}
		})
			.then(recipe => {
				res.status(200).send({ message: 'recipe successfully deleted' })
			})
			.catch(err => {
				res.status(400).send({ message: err.message })
			})
	}
}
