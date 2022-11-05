const express = require('express')
const usersRouter = express.Router()

const userController = require('../controllers/usersControllers')

usersRouter.get('/', userController.getAllUsers)
usersRouter.get('/:id', userController.getUserById)

module.exports = usersRouter
