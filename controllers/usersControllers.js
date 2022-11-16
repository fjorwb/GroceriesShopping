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
	},

	async createUser(req, res) {
		console.log(req.body)

		const { username, email, password } = req.body

		await User.create({
			username,
			email,
			password
		})
			.then(() => {
				return res.status(200).send({
					message: 'User created successfully'
				})
			})
			.catch(err => {
				return res.status(400).send({
					message: err.message
				})
			})
	},

	async updateUser(req, res) {
		console.log(req.body)
		const { username, email, password } = req.body

		const checkUser = await User.findOne({
			where: {
				id: req.params.id
			}
		})

		if (!checkUser) {
			return res.status(404).send({
				message: 'User not found'
			})
		}

		const user = await User.update(
			{
				username,
				password,
				updated_at: new Date()
			},
			{
				where: {
					id: req.params.id
				}
			}
		)
			.then(() => {
				return res.status(200).send({
					message: 'User updated successfully'
				})
			})
			.catch(err => {
				return res.status(400).send({
					message: err.message
				})
			})
	},

	async deleteUser(req, res) {
		const user = await User.destroy({
			where: {
				id: req.params.id
			}
		})

		const checkUser = await User.findOne({
			where: {
				id: req.params.id
			}
		})

		if (!checkUser) {
			return res.status(404).send({
				message: 'User not found'
			})
		}

		if (!user) {
			return res.status(400).send({
				message: 'User not deleted'
			})
		} else {
			return res.status(200).send({
				message: 'User deleted'
			})
		}
	}
}
