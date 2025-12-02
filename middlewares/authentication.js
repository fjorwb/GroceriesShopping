const jwt = require('jsonwebtoken')
const authConfig = require('../config/authConfig')

const { User } = require('../models/index')

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      // Provide helpful message for POST /users requests (user creation attempts)
      // Check if this is a POST request to /users route
      const isUserCreationAttempt = req.method === 'POST' && 
        (req.originalUrl?.startsWith('/users') || req.baseUrl?.includes('/users'))
      
      const errorMessage = isUserCreationAttempt
        ? 'No authorization access token provided. For user registration, use POST /auth/register instead. This endpoint (POST /users) is for admin user creation only.'
        : 'No authorization access token provided'
      
      return res.status(401).json({
        success: false,
        message: errorMessage
      })
    }

    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format'
      })
    }

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        })
      }

      try {
        const user = await User.findByPk(decoded.id)

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User not found'
          })
        }

        req.user = user
        next()
      } catch (dbError) {
        return res.status(500).json({
          success: false,
          message: 'Authentication error',
          error: dbError.message
        })
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication middleware error',
      error: error.message
    })
  }
}
