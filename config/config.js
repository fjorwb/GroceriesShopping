require('dotenv').config()

module.exports = {
	//Database config
	development: {
		username: process.env.USERNAME || 'groceries_shopping',
		password: process.env.PASSWORD || null,
		database: process.env.DATABASE || 'groceries_shopping',
		host: process.env.HOST || '127.0.0.1',
		dialect: process.env.DIALECT || 'postgres',
		define: {
			underscored: true
		}
	},
	test: {
		username: process.env.USERNAME || process.env.USERNAME,
		password: process.env.PASSWORD || process.env.PASSWORD,
		database: process.env.DATABASE || process.env.DATABASE,
		host: process.env.HOST || process.env.HOST,
		dialect: process.env.DIALECT || 'postgres'
	},
	production: {
		use_env_variable: 'DATABASE_URL',
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		}
		// username: process.env.USERNAME,
		// password: process.env.PASSWORD,
		// database: process.env.DATABASE,
		// host: process.env.HOST,
		// dialect: process.env.DIALECT,
		// dialectOptions: {
		// 	ssl: {
		// 		require: true, // This will help you. But you will see new error
		// 		rejectUnauthorized: false // This line will fix new error
		// 	}
		// }
	},

	//migration config
	migrationStorage: 'sequelize',
	migrationStorageTableName: 'migrations',

	//seeder config
	seederStorage: 'sequelize',
	seederStorageTableName: 'seeders'
}
