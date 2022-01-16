if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose.js')

const Category = require('../category.js')
const categories = [
  {
    name: '家居物業',
    icon: 'fas fa-home'
  },
  {
    name: '交通出行',
    icon: 'fas fa-shuttle-van'
  },
  {
    name: '休閒娛樂',
    icon: 'fas fa-grin-beam'
  },
  {
    name: '餐飲食品',
    icon: 'fas fa-utensils'
  },
  {
    name: '其他',
    icon: 'fas fa-pen'
  }
]

db.once('open', () => {
  Category.create(categories).catch(err => {
    console.log(err)
  }).finally(() => {
    console.log('categories created')
    process.exit()
  })
})
