const { User } = require('../models/index')

module.exports = {
	async getAllUsers(req, res) {
		const users = await User.findAll({
			attributes: ['id', 'email', 'username']
		})

		if (users.length === 0) {
			res.status(404).send('No users found')
		} else {
			res.status(200).send(users)
		}
	}
}
