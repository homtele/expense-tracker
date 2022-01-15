const express = require('express')
const home = require('./modules/home.js')

const router = express.Router()

router.use('/', home)

module.exports = router
