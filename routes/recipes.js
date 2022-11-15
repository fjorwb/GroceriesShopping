const express = require('express')
const recipesRouter = express.Router()

const recipesController = require('../controllers/recipesController')

recipesRouter.get('/', recipesController.getRecipesFromApi)
recipesRouter.get('/recipe', recipesController.getRecipeFromApi)

module.exports = recipesRouter
