const express = require('express')
const categoriesRouter = express.Router()

const productCategoriesController = require('../controllers/productCategoriesController')

categoriesRouter.get('/', productCategoriesController.getAllCategories)
categoriesRouter.get('/:id', productCategoriesController.getCategoryById)
categoriesRouter.post('/', productCategoriesController.createCategory)
categoriesRouter.put('/:id', productCategoriesController.updateCategory)
categoriesRouter.delete('/:id', productCategoriesController.deleteCategory)

module.exports = categoriesRouter
