const { Market } = require( '../models' )

module.exports = {
	async getAllMarkets ( req, res ) {
		const markets = await Market.findAll()
			// .then(markets => {
			// 	return markets
			// })
			.then( markets => {
				res.status( 200 ).json( markets )
			} )
			.catch( err => {
				res.status( 500 ).json( err )
			} )
	},

	async getMarketById ( req, res ) {
		const market = await Market.findOne( {
			where: {
				id: req.params.id
			}
		} )
			.then( market => {
				return market
			} )
			.catch( err => {
				return res.status( 500 ).send( { message: err.message } )
			} )

		if ( !market ) {
			return res.status( 404 ).send( { message: 'market not found' } )
		} else {
			return res.status( 200 ).send( market )
		}
	},

	async createMarket ( req, res ) {
		const checkMarket = await Market.findOne( { where: { email: req.body.email } } )

		if ( checkMarket ) {
			return res.status( 400 ).json( { message: 'market already exists' } )
		}

		const market = await Market.create( req.body )
			.then( market => {
				return res.status( 201 ).send( { message: 'market created successfully', market } )
			} )
			.catch( err => {
				return res.status( 500 ).json( err )
			} )
	},

	async updateMarket ( req, res ) {
		const checkMarket = await Market.findOne( { where: { id: req.params.id } } )

		if ( !checkMarket ) {
			return res.status( 400 ).json( { message: 'market does not exist' } )
		}

		const market = await Market.update( req.body, { where: { id: req.params.id } } )
			.then( market => {
				return res.status( 200 ).send( { message: 'market successfully updated' } )
			} )
			.catch( err => {
				return res.status( 500 ).json( err )
			} )
	},

	async deleteMarket ( req, res ) {
		const checkMarket = await Market.findOne( { where: { id: req.params.id } } )

		if ( !checkMarket ) {
			return res.status( 400 ).json( { message: 'market does not exist' } )
		}

		const market = await Market.destroy( { where: { id: req.params.id } } )
			.then( market => {
				return res.status( 200 ).send( { message: 'market succesfully deleted' } )
			} )
			.catch( err => {
				return res.status( 500 ).json( err )
			} )
	}
}
