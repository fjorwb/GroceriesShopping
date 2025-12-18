/**
 * Controller helper utilities
 * Provides reusable functions to reduce code duplication across controllers
 */

/**
 * Validates that a user is authenticated
 * @param {Object} req - Express request object
 * @returns {Object|null} Returns error response object if invalid, null if valid
 */
const validateUserAuth = (req) => {
  const userId = req.user?.id

  if (!userId) {
    return {
      status: 401,
      response: {
        success: false,
        message: 'User authentication required'
      }
    }
  }

  return null
}

/**
 * Validates that a required parameter exists
 * @param {string|number} param - Parameter value to validate
 * @param {string} paramName - Name of the parameter (for error message)
 * @returns {Object|null} Returns error response object if invalid, null if valid
 */
const validateRequiredParam = (param, paramName = 'Parameter') => {
  if (!param || param === 'undefined' || param === 'null') {
    return {
      status: 400,
      response: {
        success: false,
        message: `${paramName} is required`
      }
    }
  }

  return null
}

/**
 * Creates a standardized error response
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @param {number} defaultStatus - Default HTTP status code
 * @returns {Object} Error response object
 */
const createErrorResponse = (error, defaultMessage = 'An error occurred', defaultStatus = 500) => {
  return {
    status: defaultStatus,
    response: {
      success: false,
      message: defaultMessage,
      error: error.message
    }
  }
}

/**
 * Creates a standardized success response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} status - HTTP status code (default: 200)
 * @returns {Object} Success response object
 */
const createSuccessResponse = (data, message = null, status = 200) => {
  const response = {
    status,
    response: {
      success: true
    }
  }

  if (data !== null && data !== undefined) {
    response.response.data = data
  }

  if (message) {
    response.response.message = message
  }

  return response
}

/**
 * Handles a controller operation with standard error handling
 * @param {Function} operation - Async function to execute
 * @param {Object} options - Options object
 * @param {string} options.errorMessage - Error message for failures
 * @param {number} options.errorStatus - HTTP status code for errors (default: 500)
 * @returns {Function} Express middleware function
 */
const handleControllerOperation = (operation, options = {}) => {
  const { errorMessage = 'Operation failed', errorStatus = 500 } = options

  return async (req, res) => {
    try {
      const result = await operation(req, res)

      // If operation already sent a response, don't send another
      if (res.headersSent) {
        return
      }

      // If result is a response object, send it
      if (result && result.status && result.response) {
        return res.status(result.status).json(result.response)
      }

      // Otherwise, send success response
      return res.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      if (res.headersSent) {
        return
      }

      const errorResponse = createErrorResponse(error, errorMessage, errorStatus)
      return res.status(errorResponse.status).json(errorResponse.response)
    }
  }
}

/**
 * Checks if a resource belongs to a user
 * @param {Object} resource - Resource object from database
 * @param {number} userId - User ID to check against
 * @param {string} resourceName - Name of the resource (for error message)
 * @returns {Object|null} Returns error response object if not owned, null if owned
 */
const validateResourceOwnership = (resource, userId, resourceName = 'Resource') => {
  if (!resource) {
    return {
      status: 404,
      response: {
        success: false,
        message: `${resourceName} not found`
      }
    }
  }

  if (resource.user_id && resource.user_id !== userId) {
    return {
      status: 403,
      response: {
        success: false,
        message: `Forbidden: You don't have permission to access this ${resourceName.toLowerCase()}`
      }
    }
  }

  return null
}

/**
 * Creates a where clause for user-scoped queries
 * @param {Object} req - Express request object
 * @param {Object} additionalWhere - Additional where conditions
 * @returns {Object} Sequelize where clause
 */
const createUserWhereClause = (req, additionalWhere = {}) => {
  const userId = req.user?.id

  return {
    user_id: userId,
    ...additionalWhere
  }
}

module.exports = {
  validateUserAuth,
  validateRequiredParam,
  createErrorResponse,
  createSuccessResponse,
  handleControllerOperation,
  validateResourceOwnership,
  createUserWhereClause
}
