// user controller
const { User } = require('../models/index')
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination')

module.exports = {
  async getAllUsers(req, res) {
    try {
      // Only admins can view all users
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only admins can view all users'
        })
      }

      const { page, limit, offset } = getPaginationParams(req, { page: 1, limit: 10, maxLimit: 100 })

      const result = await User.findAndCountAll({
        attributes: ['id', 'username', 'email', 'firstname', 'lastname', 'role'],
        order: [['id', 'ASC']],
        limit,
        offset
      })

      return res.status(200).json(formatPaginatedResponse(result, { page, limit, offset }))
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      })
    }
  },

  async getUserById(req, res) {
    try {
      const userId = req.params.id

      const user = await User.findOne({
        where: {
          id: userId
        },
        attributes: [
          'id',
          'firstname',
          'lastname',
          'username',
          'email',
          // Password removed for security - never expose password hashes
          'address',
          'address2',
          'city',
          'state',
          'zip_code',
          'country',
          'phone',
          'role'
        ]
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Only allow users to view their own profile unless admin
      if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only view your own profile'
        })
      }

      return res.status(200).json({
        success: true,
        data: user
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      })
    }
  },

  async createUser(req, res) {
    try {
      // This endpoint is for admins to create users
      // Public registration should use POST /auth/register (no authentication required)
      // Note: Admin check is now handled by checkAdmin middleware before validation

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

      // Validate required fields
      if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: firstname, lastname, username, email, password'
        })
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email }
      })

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        })
      }

      // Check for duplicate username
      const existingUsername = await User.findOne({
        where: { username }
      })

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: 'User with this username already exists'
        })
      }

      // Hash password before storing
      const bcrypt = require('bcryptjs')
      const authConfig = require('../config/authConfig')
      const hashedPassword = bcrypt.hashSync(password, Number(authConfig.rounds))

      const user = await User.create({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword, // Store hashed password, not plain text
        address,
        address2,
        city,
        state,
        zip_code,
        country,
        phone,
        role: role || 'user' // Default role
      })

      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user.toJSON()

      return res.status(201).json({
        success: true,
        data: userWithoutPassword,
        message: 'User created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      })
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.params.id
      const { password, ...otherFields } = req.body

      // Only allow users to update their own profile unless admin
      if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only update your own profile'
        })
      }

      const checkUser = await User.findOne({
        where: {
          id: userId
        }
      })

      if (!checkUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Prepare update data - include all fields except password
      const updateData = { ...otherFields }
      
      // Hash password if provided
      if (password) {
        const bcrypt = require('bcryptjs')
        const authConfig = require('../config/authConfig')
        updateData.password = bcrypt.hashSync(password, Number(authConfig.rounds))
      }

      await User.update(updateData, {
        where: {
          id: userId
        }
      })

      // Fetch updated user data
      const updatedUser = await User.findByPk(userId, {
        attributes: [
          'id',
          'firstname',
          'lastname',
          'username',
          'email',
          'address',
          'address2',
          'city',
          'state',
          'zip_code',
          'country',
          'phone',
          'role'
        ]
      })

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      })
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.id

      // Only allow users to delete their own account or admins to delete any account
      if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only delete your own account'
        })
      }

      // Prevent users from deleting themselves if they're the only admin
      if (req.user.id === parseInt(userId) && req.user.role === 'admin') {
        const adminCount = await User.count({
          where: { role: 'admin' }
        })
        if (adminCount === 1) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete the last admin account'
          })
        }
      }

      const checkUser = await User.findOne({
        where: {
          id: userId
        }
      })

      if (!checkUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      await User.destroy({
        where: {
          id: userId
        }
      })

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      })
    }
  }
}
