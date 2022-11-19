const axios = require('axios')

const { Recipe, Ingredients, sequelize } = require('../models/index')

module.exports = {
	async getRecipesFromApi(req, res) {
		const { recipe, cuisine } = req.query

		const options = {
			method: 'GET',
			url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
			params: { query: recipe, cuisine, number: '10' },
			headers: {
				'X-RapidAPI-Key': 'acdc420992msh4ffbe009ed40816p166414jsn27bda9718d84',
				'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
			}
		}
		const response = await axios.request(options)
		res.send(response.data.results)
	},

	async getRecipeFromApi(req, res) {
		const idext = req.params.id

		const options = {
			method: 'GET',
			url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
			params: { includeNutrition: 'false' },
			headers: {
				'X-RapidAPI-Key': 'acdc420992msh4ffbe009ed40816p166414jsn27bda9718d84',
				'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
			}
		}

		let arr = []
		let obj = {}
		let recipe = {}

		axios
			.request(options)
			.then(function (response) {
				let resp = response.data.extendedIngredients
				let resp2 = response.data

				for (let i = 0; i < resp.length; i++) {
					arr.push({
						idext: resp[i].id,
						ingredient: resp[i].nameClean,
						amount: resp[i].amount,
						unit: resp[i].unit || 'unit'
					})
				}

				obj = { ...{ ingredients: arr } }

				recipe = {
					...obj,
					...{ servings: resp2.servings },
					...{ instructions: resp2.instructions }
				}

				res.send(recipe)
			})
			.catch(function (error) {
				console.error(error)
			})
	},

	async createExternalRecipe(req, res) {
		const idext = req.params.id

		const checkRecipe = await Recipe.findOne({
			where: { idext: idext }
		})
			.then(recipe => {
				return recipe
			})
			.catch(err => {
				return res.status(500).send(err)
			})

		console.log(!checkRecipe)

		if (checkRecipe) {
			return res.status(404).send({ message: 'recipe already exists' })
		}

		const options = {
			method: 'GET',
			url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
			params: { includeNutrition: 'false' },
			headers: {
				'X-RapidAPI-Key': 'acdc420992msh4ffbe009ed40816p166414jsn27bda9718d84',
				'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
			}
		}

		const body = await axios
			.request(options)
			.then(function (response) {
				let resp2 = response.data
				const { id, title, image, servings, instructions } = resp2
				return { idext: id, title, image, servings, instructions }
			})
			.catch(err => {
				return res.status(400).json({ error: err })
			})

		const recipe = await Recipe.create({
			idext: body.idext,
			title: body.title,
			image: body.image,
			servings: body.servings,
			instructions: body.instructions
		})
			.then(recipe => {
				return res.status(201).json(recipe)
			})
			.catch(err => {
				return res.status(400).json({ error: err })
			})

		// const recipe = await Ingredients.create(req.body, body)
		// 	.then(recipe => {
		// 		res.status(200).send(recipe)
		// 	})
		// 	.catch(err => {
		// 		res.status(400).send({ message: err.message })
		// 	})
	},

	async updateExternalRecipe(req, res) {
		const checkRecipe = await Ingredients.findOne({
			where: { id: req.params.id }
		})

		if (!checkRecipe) {
			return res.status(400).send({ message: 'recipe not found' })
		}

		const recipe = await Ingredients.update(req.body, {
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

	async deleteExternalRecipe(req, res) {
		const checkRecipe = await Ingredients.findOne({
			where: { id: req.params.id }
		})

		if (!checkRecipe) {
			return res.status(400).send({ message: 'recipe not found' })
		}

		const recipe = await Ingredients.destroy({
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
