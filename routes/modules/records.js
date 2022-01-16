const express = require('express')

const Category = require('../../models/category.js')
const Record = require('../../models/record.js')

const router = express.Router()

router.get('/new', (req, res) => {
  Category.find().lean().then(categories => {
    res.render('new', { categories })
  })
})

router.post('/', (req, res) => {
  const { name, date, categoryId, amount } = req.body
  Category.findById(categoryId).then(category => {
    return Record.create({
      name,
      date: new Date(date),
      amount: parseInt(amount),
      userId: category._id,
      categoryId: category._id,
      categoryName: category.name,
      categoryIcon: category.icon
    })
  }).then(() => {
    res.redirect('/')
  })
})

router.get('/:id([0-9a-f]{24})/edit', (req, res) => {
  Promise.all([
    Category.find().lean(),
    Record.findOne({ _id: req.params.id }).lean()
  ]).then(data => {
    data[0].forEach(category => {
      category.selected = category._id.toString() === data[1].categoryId.toString()
    })
    data[1].date = data[1].date.toISOString().slice(0, 10)
    res.render('edit', { categories: data[0], record: data[1] })
  })
})

router.put('/:id([0-9a-f]{24})', (req, res) => {
  const { name, date, categoryId, amount } = req.body
  Category.findById(categoryId).then(category => {
    return Record.findOneAndUpdate({ _id: req.params.id }, {
      name,
      date: new Date(date),
      amount: parseInt(amount),
      categoryId: category._id,
      categoryName: category.name,
      categoryIcon: category.icon
    })
  }).then(() => {
    res.redirect('/')
  })
})

router.delete('/:id([0-9a-f]{24})', (req, res) => {
  Record.findOneAndDelete({ _id: req.params.id }).then(() => {
    res.redirect('/')
  })
})

module.exports = router
