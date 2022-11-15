const axios = require('axios')

const { Recipe } = require('../models/index')

module.exports = {
	async getRecipesFromApi(req, res) {
		const options = {
			method: 'GET',
			url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
			params: { query: 'pasta', cuisine: 'italian', number: '10' },
			headers: {
				'X-RapidAPI-Key': 'acdc420992msh4ffbe009ed40816p166414jsn27bda9718d84',
				'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
			}
		}
		const response = await axios.request(options)
		res.send(response.data.results)
	},

	async getRecipeFromApi(req, res) {
		const options = {
			method: 'GET',
			url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/492272/information',
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
						title: resp[i].name,
						amount: resp[i].amount,
						unit: resp[i].unit
					})
				}

				obj = { ...{ ingredients: arr } }

				// console.log(arr)

				recipe = {
					...obj,
					...{ servings: resp2.servings },
					...{ instructions: resp2.instructions }
				}

				// arr{...,resp2.servings}

				// arr.push(resp2.instructions)

				res.send(recipe)
			})
			.catch(function (error) {
				console.error(error)
			})
	}
}
