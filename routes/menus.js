const express = require('express')
const menusRouter = express.Router()

const menusController = require('../controllers/menusController')

menusRouter.get('/', menusController.getAllMenus)
menusRouter.get('/:id', menusController.getMenuById)
menusRouter.post('/', menusController.createMenu)
menusRouter.put('/:id', menusController.updateMenu)
menusRouter.delete('/:id', menusController.deleteMenu)

module.exports = menusRouter
