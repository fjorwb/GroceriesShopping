require('dotenv').config()

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
const docsRouter = require('./routes/docs')

const authenticate = require('./middlewares/authentication')

// Middleware
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// Routes
app.use('/auth', authRouter)
app.use('/users', authenticate, usersRouter)
app.use('/recipes', authenticate, recipesRouter)
app.use('/ingredients', authenticate, ingredientsRouter)
app.use('/markets', authenticate, marketsRouter)
app.use('/products', authenticate, productsRouter)
app.use('/shoppinglists', authenticate, shoppinglistsRouter)
app.use('/menus', authenticate, menusRouter)
app.use('/categories', authenticate, categoriesRouter)
app.use('/docs', docsRouter)

app.get('/', function (req, res) {
	res.render('index')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server running on port http://localhost:${PORT}`)
})

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.')
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err)
	})
