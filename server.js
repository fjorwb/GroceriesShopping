require('dotenv').config()

const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

const { sequelize } = require('./models/index')

const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const recipesRouter = require('./routes/recipes')
const ingredientsRouter = require('./routes/ingredients')
const marketsRouter = require('./routes/markets')
const productsRouter = require('./routes/products')
const shoppinglistsRouter = require('./routes/shoppinglists')
const menusRouter = require('./routes/menus')
const categoriesRouter = require('./routes/productcategories')
const productmocksRouter = require('./routes/productmocks')
const docsRouter = require('./routes/docs')

const authenticate = require('./middlewares/authentication')

// Middleware
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))
app.use((req, res, next) => {
  // Restrict CORS to specific origins for security
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5000']

  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')

  // Allowed headers - restrict to specific headers instead of *
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  // Allow credentials
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/public', express.static(path.join(__dirname, 'public')))

// Routes
app.use('/auth', authRouter)
app.use('/users', authenticate, usersRouter)
app.use('/recipes', authenticate, recipesRouter)
app.use('/ingredients', authenticate, ingredientsRouter)
app.use('/markets', authenticate, marketsRouter)
app.use('/products', authenticate, productsRouter)
app.use('/shoppinglists', authenticate, shoppinglistsRouter)
app.use('/menus', authenticate, menusRouter)
app.use('/productcategories', authenticate, categoriesRouter)
// app.use('/productmocks', authenticate, productmocksRouter)
app.use('/productmocks', productmocksRouter)
app.use('/docs', docsRouter)

app.get('/', function (req, res) {
  res.render('index')
})

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  })
})

// Global error handler middleware (must be last)
const errorHandler = require('./middlewares/errorHandler')
app.use(errorHandler)

const SERVER_PORT = process.env.SERVER_PORT || 5000

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(SERVER_PORT, () => {
    console.log(`\nServer running on port http://localhost:${SERVER_PORT}\n`)
  })

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
}

// Export app for testing
module.exports = app
