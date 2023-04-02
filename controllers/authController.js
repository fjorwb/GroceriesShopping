const { User } = require( '../models/index' )

const bcrypt = require( 'bcrypt' )
const jwt = require( 'jsonwebtoken' )
const authConfig = require( '../config/authConfig' )

module.exports = {
	// GET /auth
	login ( req, res ) {
		const { email, password } = req.body

		const user = User.findOne( {
			where: {
				email: email
			}
		} ).then( user => {
			if ( !user ) {
				return res.status( 404 ).send( {
					message: 'User not found'
				} )
			}

			const passwordIsValid = bcrypt.compareSync( password, user.password )

			if ( !passwordIsValid ) {
				return res.status( 401 ).json( { msg: 'Invalid Password!', ok: false } )
			}

			const token = jwt.sign( { id: user.id, email: user.email }, authConfig.secret, {
				expiresIn: 86400 // 24 hours
			} )

			res.cookie( 'accessToken', { user_id: user.id, token }, { maxAge: 900000, httpOnly: true } )

			res.status( 200 ).json( {
				id: user.id,
				email: user.email,
				accessToken: token,
				role: user.role,
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname
			} )
		} )
	},

	async register ( req, res ) {
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

		const checkUser = await User.findOne( {
			where: {
				email: email
			}
		} )
			.then( user => {
				return user
			} )
			.catch( err => {
				return res.status( 500 ).send( err )
			} )

		if ( checkUser ) {
			return res.status( 400 ).send( { message: 'user already exists' } )
		}

		const salt = bcrypt.genSaltSync( 10 )
		const hash = bcrypt.hashSync( password, salt )

		const passwordEncrypted = bcrypt.hashSync( req.body.password, Number( authConfig.rounds ) )

		User.create( {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			username: req.body.username,
			email: req.body.email,
			password: passwordEncrypted,
			address: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zip_code: req.body.zip_code,
			country: req.body.country,
			phone: req.body.phone,
			role: req.body.role
		} )
			.then( user => {
				const token = jwt.sign( { user }, authConfig.secret, { expiresIn: authConfig.expiresIn } )
				res.status( 200 ).send( { user, token } )
			} )
			.catch( err => {
				res.status( 500 ).send( { message: err.message } )
			} )
	},

	async changePassword ( req, res ) {
		const { email, password, newpassword } = req.query

		const checkUser = await User.findOne( {
			where: {
				email: email
			}
		} )
			.then( user => {
				return user
			} )
			.catch( err => {
				return res.status( 500 ).send( err )
			} )

		if ( !checkUser ) {
			return res.status( 404 ).send( { message: 'user not found' } )
		}

		if ( password !== newpassword ) {
			return res.status( 400 ).send( { message: 'passwords do not match' } )
		}

		const salt = bcrypt.genSaltSync( 10 )
		const hash = bcrypt.hashSync( newpassword, salt )

		const passwordEncrypted = bcrypt.hashSync( req.query.newpassword, Number( authConfig.rounds ) )

		const user = await User.update(
			{
				password: passwordEncrypted
			},
			{
				where: {
					email: email
				}
			}
		)
			.then( user => {
				return res.status( 200 ).send( { message: 'password changed' } )
			} )
			.catch( err => {
				return res.status( 500 ).send( { message: err.message } )
			} )
	}
}
