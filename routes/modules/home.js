const express = require('express')

const Record = require('../../models/record.js')

const router = express.Router()

router.get('/', (req, res) => {
  Record.find().lean().then(records => {
    records.forEach(record => {
      record.date = record.date.toLocaleString('zh-TW', { dateStyle: 'short' })
    })
    res.render('index', { records })
  })
})

module.exports = router
