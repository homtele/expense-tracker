const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose.js')

const Category = require('../category.js')
const User = require('../user.js')
const Record = require('../record')

const users = [
  {
    name: '廣志',
    email: 'user1@example.com',
    password: '12345678',
    recordsMap: [0, 1, 2, 4]
  },
  {
    name: '小新',
    email: 'user2@example.com',
    password: '12345678',
    recordsMap: [3]
  }
]
const records = [
  {
    name: '午餐',
    amount: 60,
    categoryName: '餐飲食品'
  },
  {
    name: '晚餐',
    amount: 60,
    categoryName: '餐飲食品'
  },
  {
    name: '捷運',
    amount: 120,
    categoryName: '交通出行'
  },
  {
    name: '電影',
    amount: 220,
    categoryName: '休閒娛樂'
  },
  {
    name: '租金',
    amount: 25000,
    categoryName: '家居物業'
  }
]

db.once('open', () => {
  Category.find().then(categories => {
    return Promise.all(
      users.map(user => {
        return bcrypt.genSalt(10).then(salt => {
          return bcrypt.hash(user.password, salt)
        }).then(hash => {
          const { name, email } = user
          return User.create({ name, email, password: hash })
        }).then(_user => {
          const userRecrods = []
          records.forEach((record, recordIndex) => {
            if (user.recordsMap.includes(recordIndex)) {
              const category = categories.find(category => category.name === record.categoryName)
              const userRecord = {
                name: record.name,
                amount: record.amount,
                userId: _user._id,
                categoryId: category._id
              }
              userRecrods.push(userRecord)
            }
          })
          return Record.create(userRecrods)
        })
      })
    )
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    console.log('records created')
    process.exit()
  })
})
