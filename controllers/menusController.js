const { Menu } = require('../models')

module.exports = {
  async getAllMenus(req, res) {
    const menu = await Menu.findAll({
      where: {
        user_id: req.user.id
      }
    })

    return menu
      ? res.status(200).send(menu)
      : res.status(404).send({ message: 'Menu not found' })

    // await Menu.findAll({
    //   where: {
    //     user_id: req.user.id
    //   }
    // })
    //   .then((menus) => {
    //     res.status(200).json(menus)
    //   })
    //   .catch((err) => {
    //     res.status(500).json(err)
    //   })
  },

  async getMenuById(req, res) {
    const menu = await Menu.findOne({
      where: {
        id: req.params.id
      }
    })

    return menu
      ? res.status(200).send(menu)
      : res.status(404).send({ message: 'Menu not found' })
  },

  async createMenu(req, res) {
    const menu = await Menu.create(req.body)

    return menu
      ? res.status(201).send({ message: 'meal created successfully', menu })
      : res.status(500).send({ message: 'Error creating menu' })

    // await Menu.create(req.body)
    //   .then((menu) => {
    //     res.status(201).send({message: 'meal created successfully', menu})
    //   })
    //   .catch((err) => {
    //     res.status(500).json(err)
    //   })
  },

  async updateMenu(req, res) {
    const checkMenu = await Menu.findOne({ where: { id: req.params.id } })
      .then((menu) => {
        return menu
      })
      .catch((err) => {
        res.status(500).json(err)
      })

    if (!checkMenu) {
      return res.status(400).json({ message: 'meal not found' })
    }

    const menu = await Menu.update(req.body, { where: { id: req.params.id } })

    return menu
      ? res.status(200).send({ message: 'meal updated successfully', menu })
      : res.status(500).send(menu)

    // .then((menu) => {
    //   res.status(200).send({message: 'meal updated successfully', menu})
    // })
    // .catch((err) => {
    //   res.status(500).json(err)
    // })
  },

  async deleteMenu(req, res) {
    const checkMenu = await Menu.findByPk(req.params.id)
      .then((menu) => {
        return menu
      })
      .catch((err) => {
        res.status(500).json(err)
      })

    if (!checkMenu) {
      return res.status(400).json({ message: 'meal does not exist' })
    }

    const menu = await Menu.destroy({ where: { id: req.params.id } })

    return menu
      ? res.status(200).send({ message: 'meal deleted successfully', menu })
      : res.status(500).send(menu)

    // .then((menu) => {
    //   res.status(200).send({message: 'meal deleted successfully', menu})
    // })
    // .catch((err) => {
    //   res.status(500).json(err)
    // })
  }
}
