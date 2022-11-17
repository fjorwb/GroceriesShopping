const express = require('express')
const usersRouter = express.Router()

const userController = require('../controllers/usersControllers')

usersRouter.get('/', userController.getAllUsers)
usersRouter.post('/', userController.createUser)
usersRouter.get('/:id', userController.getUserById)
usersRouter.put('/:id', userController.updateUser)
usersRouter.delete('/:id', userController.deleteUser)

module.exports = usersRouter
