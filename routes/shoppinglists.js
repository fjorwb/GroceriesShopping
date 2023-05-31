const express = require('express')
const shoppinglistsRouter = express.Router()

const SLC = require('../controllers/shoppinglistsController')

shoppinglistsRouter.get('/', SLC.getAllShoppingLists)
shoppinglistsRouter.get('/:id', SLC.getShoppingListById)
shoppinglistsRouter.get('/shoplistid/:id', SLC.getShoppingListByShopListId)
shoppinglistsRouter.post('/', SLC.createShoppingList)
shoppinglistsRouter.put('/:id', SLC.updateShoppingList)
shoppinglistsRouter.delete(
  '/shoplistid/:id',
  SLC.deleteShoppingListByShopListId
)
shoppinglistsRouter.delete('/:id', SLC.deleteShoppingList)

module.exports = shoppinglistsRouter
