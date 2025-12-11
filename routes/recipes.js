const express = require('express')
const recipesRouter = express.Router()

const recipesController = require('../controllers/recipesController')
const externalRecipesController = require('../controllers/externalRecipesController')

// External API routes (no /recipes prefix needed since router is mounted at /recipes)
// Support both /external and /recipes for backward compatibility
recipesRouter.get('/external', externalRecipesController.getRecipesFromApi)
recipesRouter.get('/recipes', externalRecipesController.getRecipesFromApi) // Backward compatibility
recipesRouter.get('/external/:id', externalRecipesController.getRecipeFromApi)
recipesRouter.post('/external/:id', externalRecipesController.createExternalRecipe)
recipesRouter.put('/external/:id', externalRecipesController.updateExternalRecipe)
recipesRouter.delete('/external/:id', externalRecipesController.deleteExternalRecipe)

// Internal database routes
recipesRouter.get('/', recipesController.getAllRecipes)
recipesRouter.post('/', recipesController.createRecipe)
recipesRouter.get('/:id', recipesController.getRecipeById)
recipesRouter.put('/:id', recipesController.updateRecipe)
recipesRouter.delete('/:id', recipesController.deleteRecipe)

module.exports = recipesRouter
