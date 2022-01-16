const express = require('express')

const Category = require('../../models/category.js')
const Record = require('../../models/record.js')

const router = express.Router()

router.get('/new', (req, res) => {
  Category.find().lean().then(categories => {
    res.render('new', { categories })
  }).catch(err => console.log(err))
})

router.post('/', (req, res) => {
  const { name, date, categoryId, amount } = req.body
  Category.findById(categoryId).then(category => {
    return Record.create({
      name,
      date: new Date(date),
      amount: parseInt(amount),
      userId: req.user._id,
      categoryId: category._id,
      categoryName: category.name,
      categoryIcon: category.icon
    })
  }).then(() => {
    res.redirect('/')
  }).catch(err => console.log(err))
})

router.get('/:id([0-9a-f]{24})/edit', (req, res, next) => {
  Promise.all([
    Category.find().lean(),
    Record.findOne({ _id: req.params.id, userId: req.user._id }).lean()
  ]).then(data => {
    if (!data[1]) {
      next()
      return
    }
    data[0].forEach(category => {
      category.selected = category._id.toString() === data[1].categoryId.toString()
    })
    data[1].date = data[1].date.toISOString().slice(0, 10)
    res.render('edit', { categories: data[0], record: data[1] })
  }).catch(err => console.log(err))
})

router.put('/:id([0-9a-f]{24})', (req, res, next) => {
  const { name, date, categoryId, amount } = req.body
  Category.findById(categoryId).then(category => {
    return Record.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
      name,
      date: new Date(date),
      amount: parseInt(amount),
      categoryId: category._id,
      categoryName: category.name,
      categoryIcon: category.icon
    })
  }).then(record => {
    if (!record) {
      next()
      return
    }
    res.redirect('/')
  }).catch(err => console.log(err))
})

router.delete('/:id([0-9a-f]{24})', (req, res, next) => {
  Record.findOneAndDelete({ _id: req.params.id, userId: req.user._id }).then(record => {
    if (!record) {
      next()
      return
    }
    res.redirect('/')
  }).catch(err => console.log(err))
})

module.exports = router
