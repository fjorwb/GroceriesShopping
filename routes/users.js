const express = require('express')
const usersRouter = express.Router()

usersRouter.get('/', (req, res) => {
	res.send('getAllUsers')
})

module.exports = usersRouter
