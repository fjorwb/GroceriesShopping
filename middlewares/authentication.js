const jwt = require('jsonwebtoken')
const authConfig = require('../config/authConfig')

const { User } = require('../models/index')

module.exports = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json({ msg: 'No authorization access token provided' })
	} else {
		const token = req.headers.authorization.split(' ')[1]
		// console.log('token xxxx>>>> ', token);

		jwt.verify(token, authConfig.secret, (err, decoded) => {
			if (err) {
				return res.status(401).json({ msg: 'Invalid token' })
			}

			// console.log('decoded>>> ', decoded)

			User.findByPk(decoded.id, {}).then(user => {
				// console.log('user_id>>> ',user.role[0].dataValues.id)

				req.user = user
				// console.log('req.user.id>>> ',req.user.dataValues.id)
				next()
			})
		})
	}
}
