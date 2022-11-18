const express = require('express')
const usersRouter = express.Router()

const userController = require('../controllers/usersControllers')

const authenticate = require('../middlewares/authentication')

usersRouter.get('/', authenticate, userController.getAllUsers)
usersRouter.post('/', authenticate, userController.createUser)
usersRouter.get('/:id', authenticate, userController.getUserById)
usersRouter.put('/:id', authenticate, userController.updateUser)
usersRouter.delete('/:id', authenticate, userController.deleteUser)

module.exports = usersRouter
