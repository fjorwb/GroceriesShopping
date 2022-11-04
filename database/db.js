const { Sequelize } = require('sequelize')
const config = require('../config/config.js')

const db = {}

db.connection = new Sequelize(config.database, config.username, config.password, config)

// sequelize = new Sequelize(process.env.DATABASE_URL, {
// 	dialectOptions: {
// 		ssl: {
// 			require: true,
// 			rejectUnauthorized: false
// 		}
// 	}
// });

module.exports = db
