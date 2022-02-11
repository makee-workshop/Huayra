'use strict'
const passport = require('passport')

var ensureAuthenticated = passport.authenticate('jwt', { session: false })

function ensureAccount (req, res, next) {
  if (req.user.canPlayRoleOf('account')) {
    if (req.app.config.requireAccountVerification) {
      if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/account/verification/')
      }
    }
    return next()
  }
  res.redirect('/')
}

function ensureAdmin (req, res, next) {
  if (req.user.canPlayRoleOf('admin')) {
    return next()
  }
  res.redirect('/')
}

exports = module.exports = function (app, passport) {
  // front end
  app.post('/1/contact/', require('./controllers/contact/index').sendMessage)

  // sign up
  app.post('/1/signup/', require('./controllers/signup/index').signup)

  // login/out
  app.post('/1/login/', require('./controllers/login/index').login)
  app.post('/login/forgot/', require('./controllers/login/forgot/index').send)
  app.put('/1/login/reset/:email/:token/', require('./controllers/login/reset/index').set)

  // account
  app.all('/account*', ensureAuthenticated)
  app.all('/account*', ensureAccount)

  // account > verification
  app.post('/account/verification/', require('./controllers/account/verification/index').resendVerification)
  app.get('/account/verification/:token/', require('./controllers/account/verification/index').verify)

  app.all('/1/account*', ensureAuthenticated)
  app.all('/1/account*', ensureAccount)

  app.get('/1/account/logout/', require('./controllers/logout/index').logout)

  // account > settings
  app.put('/1/account/settings/', require('./controllers/account/settings/index').update)
  app.put('/1/account/settings/identity/', require('./controllers/account/settings/index').identity)
  app.put('/1/account/settings/password/', require('./controllers/account/settings/index').password)

  // 範例
  app.get('/1/post', require('./controllers/example/post').readAll)
  app.post('/1/post', require('./controllers/example/post').create)
  app.post('/1/post/query', require('./controllers/example/post').createByQuery)
  app.put('/1/post/:name/publish', require('./controllers/example/post').activate)
  app.put('/1/post/:name/unpublish', require('./controllers/example/post').inactivate)
  app.delete('/1/post/:id', require('./controllers/example/post').delete)
  app.post('/2/post', require('./controllers/example/post2').create)
  app.put('/2/post/:id', require('./controllers/example/post2').update)

  app.get('/1/account', ensureAuthenticated)
  app.get('/1/account', ensureAccount)
  app.get('/1/account', require('./controllers/account/index').getAccountInfo)

  app.get('/1/user', ensureAuthenticated)
  app.get('/1/user', ensureAccount)
  app.get('/1/user', require('./controllers/account/index').getUserInfo)

  app.all('/1/admin*', ensureAuthenticated)
  app.all('/1/admin*', ensureAdmin)

  app.get('/1/admin/count', require('./controllers/admin/index').init)
  app.get('/1/admin/users', require('./controllers/account/index').adminGetUsers)
  app.get('/1/admin/account/:id', require('./controllers/account/index').adminGetAccountInfo)
  app.get('/1/admin/user/:id', require('./controllers/account/index').admingetUserInfo)
  app.put('/1/admin/account/:id', require('./controllers/admin/accounts').update)
  app.put('/1/admin/user/:id', require('./controllers/admin/users').update)
  app.put('/1/admin/user/:id/password', require('./controllers/admin/users').password)
  app.delete('/1/admin/users/:id', require('./controllers/admin/users').delete)

  // route not found
  // app.all('*', require('./controllers/http/index').http404)
}
