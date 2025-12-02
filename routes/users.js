const express = require('express')
const usersRouter = express.Router()

const userController = require('../controllers/usersControllers')
const handleValidationErrors = require('../middlewares/validation')
const checkAdmin = require('../middlewares/checkAdmin')
const { validateCreateUser, validateUpdateUser, validateUserId } = require('../validators/userValidators')

// Authentication is already applied in server.js, no need to duplicate here
usersRouter.get('/', userController.getAllUsers)
// Check admin status before validation for createUser
usersRouter.post('/', checkAdmin, validateCreateUser, handleValidationErrors, userController.createUser)
usersRouter.get('/:id', validateUserId, handleValidationErrors, userController.getUserById)
usersRouter.put('/:id', validateUserId, validateUpdateUser, handleValidationErrors, userController.updateUser)
usersRouter.delete('/:id', validateUserId, handleValidationErrors, userController.deleteUser)

module.exports = usersRouter
