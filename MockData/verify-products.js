const db = require('../models')

async function verifyProducts() {
  try {
    console.log('Connecting to database...')
    await db.sequelize.authenticate()
    console.log('Connected successfully')

    const count = await db.ProductMock.count()
    console.log(`\nTotal products in productsmock table: ${count}`)

    if (count > 0) {
      const products = await db.ProductMock.findAll({
        limit: 10,
        order: [['id', 'ASC']]
      })
      console.log('\nSample products:')
      products.forEach(p => {
        console.log(`- ID: ${p.id}, Name: ${p.name} (${p.unit}), Price: $${p.price}, Market: ${p.market_id}`)
      })

      // Show products by market
      const markets = await db.ProductMock.findAll({
        attributes: ['market_id', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
        group: ['market_id']
      })
      console.log('\nProducts per market:')
      markets.forEach(m => {
        console.log(`- Market ${m.market_id}: ${m.dataValues.count} products`)
      })
    } else {
      console.log('No products found in the database')
    }

    await db.sequelize.close()
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Full error:', error)
    if (db.sequelize) {
      await db.sequelize.close()
    }
  }
}

verifyProducts()
