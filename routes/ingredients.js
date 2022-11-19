const express = require('express')
const ingredientsRouter = express.Router()

const ingredientsController = require('../controllers/ingredientsController')

ingredientsRouter.get('/', ingredientsController.getAllIngredients)
ingredientsRouter.get('/:id', ingredientsController.getIngredientById)
ingredientsRouter.post('/', ingredientsController.createIngredient)
ingredientsRouter.put('/:id', ingredientsController.updateIngredient)
ingredientsRouter.delete('/:id', ingredientsController.deleteIngredient)

module.exports = ingredientsRouter
