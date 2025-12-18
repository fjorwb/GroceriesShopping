const { User } = require('../models/index')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/authConfig')

module.exports = {
  // POST /auth/login
  login (req, res) {
    const { email, password } = req.body

    User.findOne({
      where: {
        email
      }
    }).then(user => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password)

      if (!passwordIsValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        })
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn
        }
      )

      // Exclude password from user object
      const { password: _, ...userWithoutPassword } = user.toJSON()

      res.status(200).json({
        success: true,
        token,
        user: userWithoutPassword
      })
    }).catch(err => {
      return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: err.message
      })
    })
  },

  async register (req, res) {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      address,
      address2,
      city,
      state,
      zip_code,
      country,
      phone,
      role
    } = req.body

    const checkUser = await User.findOne({
      where: {
        email
      }
    })
      .then(user => {
        return user
      })
      .catch(err => {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        })
      })

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    const passwordEncrypted = bcrypt.hashSync(
      req.body.password,
      Number(authConfig.rounds)
    )

    User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: passwordEncrypted,
      address: req.body.address,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zip_code: req.body.zip_code,
      country: req.body.country,
      phone: req.body.phone,
      role: req.body.role || 'user'
    })
      .then(user => {
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })

        // Exclude password from user object
        const { password: _, ...userWithoutPassword } = user.toJSON()

        res.status(200).json({
          success: true,
          token,
          user: userWithoutPassword
        })
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          message: 'Registration failed',
          error: err.message
        })
      })
  },

  async changePassword (req, res) {
    try {
      // Use body instead of query for security (passwords in query strings are logged)
      const { currentPassword, newPassword } = req.body
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        })
      }

      // Validation is now handled by express-validator middleware

      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Verify current password matches
      const passwordIsValid = bcrypt.compareSync(currentPassword, user.password)

      if (!passwordIsValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }

      // Hash and update to new password
      const passwordEncrypted = bcrypt.hashSync(
        newPassword,
        Number(authConfig.rounds)
      )

      await User.update(
        {
          password: passwordEncrypted
        },
        {
          where: {
            id: userId
          }
        }
      )

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      })
    }
  }
}
