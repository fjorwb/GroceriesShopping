const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const authenticate = require('../middlewares/authentication')
const handleValidationErrors = require('../middlewares/validation')
const { validateLogin, validateRegister, validateChangePassword } = require('../validators/authValidators')

router.post('/login', validateLogin, handleValidationErrors, authController.login)
router.post('/register', validateRegister, handleValidationErrors, authController.register)
// Change password requires authentication
router.post('/changepassword', authenticate, validateChangePassword, handleValidationErrors, authController.changePassword)

module.exports = router
