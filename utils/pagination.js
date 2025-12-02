/**
 * Pagination utility functions
 * Provides helpers for paginating Sequelize queries
 */

/**
 * Get pagination parameters from request query
 * @param {Object} req - Express request object
 * @param {Object} defaults - Default values { page: 1, limit: 10, maxLimit: 100 }
 * @returns {Object} { page, limit, offset }
 */
const getPaginationParams = (req, defaults = {}) => {
  const defaultPage = defaults.page || 1
  const defaultLimit = defaults.limit || 10
  const maxLimit = defaults.maxLimit || 100

  const page = Math.max(1, parseInt(req.query.page) || defaultPage)
  const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit) || defaultLimit))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Format paginated response
 * @param {Object} result - Sequelize findAndCountAll result
 * @param {Object} pagination - { page, limit, offset }
 * @returns {Object} Formatted response with pagination metadata
 */
const formatPaginatedResponse = (result, pagination) => {
  const { count, rows } = result
  const { page, limit } = pagination
  const totalPages = Math.ceil(count / limit)

  return {
    success: true,
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

/**
 * Middleware to add pagination to request
 * Adds req.pagination with { page, limit, offset }
 */
const paginationMiddleware = (defaults = {}) => {
  return (req, res, next) => {
    req.pagination = getPaginationParams(req, defaults)
    next()
  }
}

module.exports = {
  getPaginationParams,
  formatPaginatedResponse,
  paginationMiddleware,
}

