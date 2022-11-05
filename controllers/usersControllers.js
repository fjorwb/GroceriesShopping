//user controller
const { User } = require('../models/index')

module.exports = {
	async getAllUsers(req, res) {
		const users = await User.findAll({
			attributes: ['id', 'username', 'email']
		})

		if (!users) {
			return res.status(404).send({
				message: 'No users found'
			})
		} else {
			return res.status(200).send(users)
		}
	},

	async getUserById(req, res) {
		const user = await User.findOne({
			where: {
				id: req.params.id
			},
			attributes: ['id', 'username', 'email']
		})

		if (!user) {
			return res.status(404).send({
				message: 'User not found'
			})
		} else {
			return res.status(200).send(user)
		}
	}
}
