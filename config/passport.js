const passport = require('passport')
const bcrypt = require('bcryptjs')

const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.js')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email }).then(user => {
      if (!user) {
        done(null, false, req.flash('message', '你輸入的電子郵件地址並未與帳號連結。'))
        return
      }
      if (!bcrypt.compareSync(password, user.password)) {
        done(null, false, req.flash('message', '你所輸入的密碼錯誤。'))
        return
      }
      done(null, user)
    }).catch(err => done(err))
  }))
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id).lean().then(user => {
      done(null, user)
    }).catch(err => done(err))
  })
}
