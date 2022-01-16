const express = require('express')
const { authenticator } = require('../middlewares/auth.js')

const home = require('./modules/home.js')
const records = require('./modules/records.js')
const users = require('./modules/users.js')

const router = express.Router()

router.use('/records', authenticator, records)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router
