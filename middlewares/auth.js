module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
      return
    }
    req.flash('warning_message', '請登入以使用這個網站。')
    res.redirect('/users/login')
  }
}
