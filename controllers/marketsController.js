const { Market } = require('../models')

module.exports = {
	async getAllMarkets(req, res) {
		const markets = await Market.findAll()
			.then(markets => {
				return markets
			})
			.then(markets => {
				res.status(200).json(markets)
			})
			.catch(err => {
				res.status(500).json(err)
			})
	},

	async getMarketById(req, res) {
		const market = await Market.findByPk(req.params.id)
			.then(market => {
				return market
			})
			.then(market => {
				res.status(200).json(market)
			})
			.catch(err => {
				res.status(500).json(err)
			})
	},

	async createMarket(req, res) {
		const checkMarket = await Market.findOne({ where: { email: req.body.email } })

		console.log(checkMarket)

		if (checkMarket) {
			return res.status(400).json({ message: 'market already exists' })
		}

		const market = await Market.create(req.body)
			.then(market => {
				return res.status(201).send({ message: 'market created successfully', market })
			})
			.catch(err => {
				return res.status(500).json(err)
			})
	},

	async updateMarket(req, res) {
		console.log(req.params.id)
		const checkMarket = await Market.findOne({ where: { id: req.params.id } })

		// console.log('CHECK>>>', checkMarket.dataValues.id)
		// console.log('req.body>>>', req.body.id)

		if (!checkMarket) {
			return res.status(400).json({ message: 'market does not exist' })
		}

		const market = await Market.update(req.body, { where: { id: req.params.id } })
			.then(market => {
				return res.status(200).send({ message: 'market successfully updated' })
			})
			.catch(err => {
				return res.status(500).json(err)
			})
	},

	async deleteMarket(req, res) {
		const checkMarket = await Market.findOne({ where: { id: req.params.id } })

		if (!checkMarket) {
			return res.status(400).json({ message: 'market does not exist' })
		}

		const market = await Market.destroy({ where: { id: req.params.id } })
			.then(market => {
				return res.status(200).send({ message: 'market succesfully deleted' })
			})
			.catch(err => {
				return res.status(500).json(err)
			})
	}
}
