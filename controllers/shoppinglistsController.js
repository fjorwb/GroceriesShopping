const { ShoppingList } = require( '../models' )

module.exports = {
	async getAllShoppingLists ( req, res ) {
		await ShoppingList.findAll( {
			where: {
				user_id: req.user.id
			}
		} )
			.then( ( shoppingLists ) => {
				return res.status( 200 ).json( shoppingLists )
			} )
			.catch( ( error ) => {
				return res.status( 500 ).json( error )
			} )
	},

	async getShoppingListById ( req, res ) {
		const shoppinglist = await ShoppingList.findOne( {
			where: {
				id: req.params.id
			}
		} )
			.then( ( shoppinglist ) => {
				return shoppinglist
			} )
			.catch( ( error ) => {
				return res.status( 500 ).json( error )
			} )

		if ( !shoppinglist ) {
			return res.status( 404 ).json( { message: 'shopping list not found' } )
		} else {
			return res.status( 200 ).json( shoppinglist )
		}
	},

	async getShoppingListByShopListId ( req, res ) {
		const shoppinglist = await ShoppingList.findOne( {
			where: {
				shop_list_id: req.params.id
			}
		} )
			.then( ( shoppinglist ) => {
				return shoppinglist
			} )
			.catch( ( error ) => {
				return res.status( 500 ).json( error )
			} )

		if ( !shoppinglist ) {
			return res.status( 404 ).json( { message: 'shopping list not found' } )
		} else {
			return res.status( 200 ).json( shoppinglist )
		}
	},

	async createShoppingList ( req, res ) {
		console.log( req.body )
		const checkShoppingList = await ShoppingList.findOne( {
			where: {
				shop_list_id: req.body.shop_list_id
			}
		} )

		if ( checkShoppingList ) {
			return res.status( 500 ).json( { message: 'shoppingList already exists' } )
		}

		const shoppinglist = await ShoppingList.create( req.body )
			.then( ( shoppinglist ) => {
				return res
					.status( 201 )
					.send( { message: 'shoppingList created successfully', shoppinglist } )
			} )
			.catch( ( err ) => {
				return res.status( 500 ).json( err )
			} )
	},

	async updateShoppingList ( req, res ) {

		console.log( req.params )

		// const checkShoppingList = await ShoppingList.findOne( {
		// 	where: {
		// 		shop_list_id: req.params.shop_list_id
		// 	}
		// } )

		// if ( !checkShoppingList ) {
		// 	return res.status( 500 ).json( { message: 'shoppingList not found' } )
		// }

		// const shoppinglist = await ShoppingList.update( req.body, {
		// 	where: {
		// 		shop_list_id: req.params.id
	}
} )
			.then( ( shoppinglist ) => {
	res.status( 200 ).send( { message: 'shoppingList updated successfully' } )
} )
	.catch( ( err ) => {
		res.status( 500 ).json( err )
	} )
	},

	async deleteShoppingList( req, res ) {
	const checkShoppingList = await ShoppingList.findByPk( req.params.id )

	if ( !checkShoppingList ) {
		return res.status( 404 ).json( { message: 'shoppingList not found' } )
	}

	const shoppinglist = await ShoppingList.destroy( {
		where: {
			id: req.params.id
		}
	} )
		.then( ( shoppinglist ) => {
			res.status( 200 ).send( { message: 'shoppingList deleted successfully' } )
		} )
		.catch( ( err ) => {
			res.status( 500 ).json( err )
		} )
},

	async deleteShoppingListByShopListId( req, res ) {
	const checkShoppingList = await ShoppingList.findOne( {
		where: {
			shop_list_id: req.params.id
		}
	} )

	if ( !checkShoppingList ) {
		return res.status( 404 ).json( { message: 'shoppingList not found' } )
	}

	const shoppinglist = await ShoppingList.destroy( {
		where: {
			shop_list_id: req.params.id
		}
	} )
		.then( ( shoppinglist ) => {
			res.status( 200 ).send( { message: 'shoppingList deleted successfully' } )
		} )
		.catch( ( err ) => {
			res.status( 500 ).json( err )
		} )
}
}
