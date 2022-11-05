const express = require('express')
const usersRouter = express.Router()

const userController = require('../controllers/usersControllers')

usersRouter.get('/', userController.getAllUsers)

module.exports = usersRouter
