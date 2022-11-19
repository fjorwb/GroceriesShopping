//user controller
const { User } = require('../models/index')

module.exports = {
	async getAllUsers(req, res) {
		const users = await User.findAll({
			attributes: ['id', 'username', 'email'],
			order: [['id', 'ASC']]
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
			attributes: [
				'id',
				'firstname',
				'lastname',
				'username',
				'email',
				'password',
				'address',
				'address2',
				'city',
				'state',
				'zip_code',
				'country',
				'phone',
				'role'
			]
		})

		if (!user) {
			return res.status(404).send({ message: 'User not found' })
		} else {
			return res.status(200).send(user)
		}
	},

	async createUser(req, res) {
		console.log(req.body)

		const {
			firstname,
			lastname,
			username,
			email,
			password,
			address,
			address2,
			city,
			state,
			zip_code,
			country,
			phone,
			role
		} = req.body

		await User.create({
			firstname,
			lastname,
			username,
			email,
			password,
			address,
			address2,
			city,
			state,
			zip_code,
			country,
			phone,
			role
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
				email,
				password
				// updated_at: new Date()
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

		await User.destroy({
			where: {
				id: req.params.id
			}
		})
			.then(() => {
				return res.status(200).send({
					message: 'User deleted successfully'
				})
			})
			.catch(err => {
				return res.status(400).send({
					message: err.message
				})
			})
	}
}
