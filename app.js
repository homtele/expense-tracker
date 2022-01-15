const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./routes/index.js')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(routes)

app.listen(process.env.PORT, () => {
  console.log(`The server is listening on http://localhost:${process.env.PORT}`)
})
