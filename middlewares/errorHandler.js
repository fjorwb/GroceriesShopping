/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns standardized error responses
 * Must be the last middleware in the chain
 */

const errorHandler = (err, req, res, next) => {
  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err.stack)
  } else {
    // In production, log to a logging service (e.g., Winston, Sentry)
    // For now, we'll just log a sanitized version
    console.error('Error:', err.message)
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }))

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    })
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
      error: err.errors?.[0]?.message || err.message
    })
  }

  // Handle Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference: related resource does not exist',
      error: err.message
    })
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'Token is malformed or invalid'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'Please login again'
    })
  }

  // Handle custom application errors with status codes
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'An error occurred',
      ...(process.env.NODE_ENV !== 'production' && { error: err.stack })
    })
  }

  // Default to 500 Internal Server Error
  // Don't expose internal error details in production
  const errorMessage = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error'

  return res.status(500).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && {
      error: err.stack,
      details: err
    })
  })
}

module.exports = errorHandler
