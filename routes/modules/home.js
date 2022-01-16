const express = require('express')

const Category = require('../../models/category.js')
const Record = require('../../models/record.js')

const router = express.Router()

router.get('/', (req, res) => {
  Promise.all([
    Category.find().lean(),
    Record.find().lean()
  ]).then(data => {
    let totalAmount = 0
    data[1].forEach(record => {
      record.date = record.date.toLocaleString('zh-TW', { dateStyle: 'short' })
      totalAmount += record.amount
    })
    res.render('index', { selected: true, categories: data[0], totalAmount, records: data[1] })
  })
})

router.get('/category', (req, res) => {
  if (req.query.id === 'all') {
    res.redirect('/')
    return
  }
  Promise.all([
    Category.find().lean(),
    Record.find({ categoryId: req.query.id }).lean()
  ]).then(data => {
    let totalAmount = 0
    data[0].forEach(category => {
      category.selected = category._id.toString() === req.query.id
    })
    data[1].forEach(record => {
      record.date = record.date.toLocaleString('zh-TW', { dateStyle: 'short' })
      totalAmount += record.amount
    })
    res.render('index', { categories: data[0], totalAmount, records: data[1] })
  })
})

module.exports = router
