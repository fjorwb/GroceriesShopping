const express = require('express')
const shoppinglistsRouter = express.Router()

const shoppinglistsController = require('../controllers/shoppinglistsController')

shoppinglistsRouter.get('/shoplistid/:id', shoppinglistsController.getShoppingListByShopListId)
shoppinglistsRouter.delete(
  '/shoplistid/:id',
  shoppinglistsController.deleteShoppingListByShopListId
)
shoppinglistsRouter.get('/', shoppinglistsController.getAllShoppingLists)
shoppinglistsRouter.get('/:id', shoppinglistsController.getShoppingListById)
shoppinglistsRouter.post('/', shoppinglistsController.createShoppingList)
shoppinglistsRouter.put('/:id', shoppinglistsController.updateShoppingList)
shoppinglistsRouter.delete('/:id', shoppinglistsController.deleteShoppingList)

module.exports = shoppinglistsRouter
