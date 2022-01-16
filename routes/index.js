const express = require('express')
const home = require('./modules/home.js')
const records = require('./modules/records.js')

const router = express.Router()

router.use('/records', records)
router.use('/', home)

module.exports = router
