const express = require('express')
const recipesRouter = express.Router()

const recipesController = require('../controllers/recipesController')
const externalRecipesController = require('../controllers/externalRecipesController')

recipesRouter.get('/recipes', externalRecipesController.getRecipesFromApi)
recipesRouter.post(
  '/recipes/:id',
  externalRecipesController.createExternalRecipe
)
recipesRouter.get('/recipes/:id', externalRecipesController.getRecipeFromApi)
recipesRouter.put(
  '/recipes/:id',
  externalRecipesController.updateExternalRecipe
)
recipesRouter.delete(
  '/recipes/:id',
  externalRecipesController.deleteExternalRecipe
)

recipesRouter.get('/', recipesController.getAllRecipes)
recipesRouter.post('/', recipesController.createRecipe)
recipesRouter.get('/:id', recipesController.getRecipeById)
recipesRouter.put('/:id', recipesController.updateRecipe)
recipesRouter.delete('/:id', recipesController.deleteRecipe)

module.exports = recipesRouter
