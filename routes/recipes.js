const express = require('express')
const recipesRouter = express.Router()

const recipesController = require('../controllers/recipesController')

recipesRouter.get('/recipes', recipesController.getRecipesFromApi)
recipesRouter.get('/recipe', recipesController.getRecipeFromApi)

recipesRouter.get('/', recipesController.getAllRecipes)
recipesRouter.post('/', recipesController.createRecipe)
recipesRouter.get('/:id', recipesController.getRecipeById)
recipesRouter.put('/:id', recipesController.updateRecipe)
recipesRouter.delete('/:id', recipesController.deleteRecipe)

module.exports = recipesRouter
