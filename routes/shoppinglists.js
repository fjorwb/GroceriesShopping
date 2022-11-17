const express = require('express')
const shoppinglistsRouter = express.Router()

const shoppinglistController = require('../controllers/shoppinglistsController')

shoppinglistsRouter.get('/', shoppinglistController.getAllShoppingLists)
shoppinglistsRouter.get('/:id', shoppinglistController.getShoppingListById)
shoppinglistsRouter.post('/', shoppinglistController.createShoppingList)
shoppinglistsRouter.put('/:id', shoppinglistController.updateShoppingList)
shoppinglistsRouter.delete('/:id', shoppinglistController.deleteShoppingList)

module.exports = shoppinglistsRouter
