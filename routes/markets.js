const express = require('express')
const marketsRouter = express.Router()

const marketsController = require('../controllers/marketsController')

marketsRouter.get('/', marketsController.getAllMarkets)
marketsRouter.get('/:id', marketsController.getMarketById)
marketsRouter.post('/', marketsController.createMarket)
marketsRouter.put('/:id', marketsController.updateMarket)
marketsRouter.delete('/:id', marketsController.deleteMarket)

module.exports = marketsRouter
