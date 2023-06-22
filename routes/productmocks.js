const express = require('express')

const productmocksRouter = express.Router()

const productmocksController = require('../controllers/productmockController')

productmocksRouter.get('/', productmocksController.getAllProductMocks)
productmocksRouter.post('/', productmocksController.createProductMocks)
productmocksRouter.get('/:id', productmocksController.getProductMocksById)
productmocksRouter.put('/:id', productmocksController.updateProductMocks)
productmocksRouter.delete('/:id', productmocksController.deleteProductMocks)
productmocksRouter.delete('/', productmocksController.deleteAllProductMocks)

module.exports = productmocksRouter
