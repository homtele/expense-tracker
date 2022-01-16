const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../../models/user.js')

const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const errors = []
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '你輸入的電子郵件已經註冊。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '你所輸入的密碼不一致。' })
    }
    if (errors.length) {
      res.render('register', { errors })
      return
    }
    bcrypt.genSalt(10).then(salt => {
      return bcrypt.hash(password, salt)
    }).then(hash => {
      return User.create({
        name,
        email,
        password: hash
      })
    }).then(() => {
      req.flash('success_message', '註冊成功，請登入帳號。')
      res.redirect('/users/login')
    })
  }).catch(err => console.log(err))
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.flash('success_message', '登出成功。')
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
