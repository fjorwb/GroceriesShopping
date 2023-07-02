const axios = require('axios')

const { Ingredient } = require('../models')

module.exports = {
  async createExternalIngredient(req, res) {
    const { idext } = req.params

    const checkIngredient = await Ingredient.findOne({
      where: {
        idext
      }
    })
      .then((ingredient) => {
        return ingredient
      })
      .catch((err) => {
        return res.status(400).json(err)
      })

    if (checkIngredient) {
      return res.status(400).send({ message: 'ingredients already exists' })
    }

    const options = {
      method: 'GET',
      url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${idext}/information`,
      params: { includeNutrition: 'false' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
      }
    }

    const body = await axios
      .request(options)
      .then(function (response) {
        const resp2 = response.data
        const { id, extendedIngredients, servings, instructions } = resp2
        return {
          idext: id,
          ingredients: extendedIngredients,
          servings,
          instructions
        }
      })
      .catch((err) => {
        console.log(err)
        // return res.status( 400 ).json( { error: err } )
      })

    const externalIngredient = await Ingredient.create({
      idext: body.idext,
      ingredients: body.ingredients,
      servings: body.servings,
      instructions: body.instructions
    })
      .then((ingredient) => {
        return res.status(201).send(ingredient)
      })
      .catch((err) => {
        return res.status(400).send(err)
      })
  }
}
