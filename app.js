const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const routes = require('./routes/index.js')
const usePassport = require('./config/passport.js')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose.js')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, flash: true }))
app.use(flash())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_message = req.flash('success_message')
  res.locals.warning_message = req.flash('warning_message')
  res.locals.message = req.flash('message')
  next()
})
app.use(routes)
app.use((req, res, next) => {
  res.redirect('/')
})

app.listen(process.env.PORT, () => {
  console.log(`The server is listening on http://localhost:${process.env.PORT}`)
})
