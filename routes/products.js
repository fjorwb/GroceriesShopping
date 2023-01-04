const express = require('express')
const productsRouter = express.Router()

const productsController = require('../controllers/productsController')

productsRouter.get('/', productsController.getAllProducts)
productsRouter.post('/', productsController.createProduct)
productsRouter.get('/:id', productsController.getProductById)
productsRouter.put('/:id', productsController.updateProduct)
productsRouter.delete('/:id', productsController.deleteProduct)

module.exports = productsRouter
