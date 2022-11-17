require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// const Sequelize = require('sequelize')
// sequelize = new Sequelize(process.env.DATABASE_URL, {
// 	dialectOptions: {
// 		ssl: {
// 			require: true,
// 			rejectUnauthorized: false
// 		}
// 	}
// })

const { sequelize } = require('./models/index')

const usersRouter = require('./routes/users')
const recipesRouter = require('./routes/recipes')
const marketsRouter = require('./routes/markets')

// const { urlencoded } = require('body-parser')

// Middleware
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))

// Routes
app.use('/users', usersRouter)
app.use('/recipes', recipesRouter)
app.use('/markets', marketsRouter)

app.get('/', (req, res) => {
	res.send('Hello World!!!!!!!!!!!!!!!!!!')
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
