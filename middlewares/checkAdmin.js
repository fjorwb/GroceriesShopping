/**
 * Middleware to check if user is admin
 * Should be applied before validation for admin-only endpoints
 */
const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Only admins can access this endpoint'
    })
  }

  next()
}

module.exports = checkAdmin

