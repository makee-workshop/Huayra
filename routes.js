'use strict'

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.set('X-Auth-Required', 'true')
  req.session.returnUrl = req.originalUrl
  res.redirect('/login/')
}

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
  app.post('/signup/', require('./controllers/signup/index').signup)

  // login/out
  app.post('/1/login/', require('./controllers/login/index').login)
  app.post('/login/forgot/', require('./controllers/login/forgot/index').send)
  app.put('/1/login/reset/:email/:token/', require('./controllers/login/reset/index').set)
  app.get('/1/logout/', require('./controllers/logout/index').logout)

  // account
  app.all('/account*', ensureAuthenticated)
  app.all('/account*', ensureAccount)

  // account > verification
  app.post('/account/verification/', require('./controllers/account/verification/index').resendVerification)
  app.get('/account/verification/:token/', require('./controllers/account/verification/index').verify)

  // account > settings
  app.put('/1/account/settings/', require('./controllers/account/settings/index').update)
  app.put('/1/account/settings/identity/', require('./controllers/account/settings/index').identity)
  app.put('/1/account/settings/password/', require('./controllers/account/settings/index').password)

  // 範例
  app.get('/1/post', require('./controllers/api/post').readAll)
  app.post('/1/post', require('./controllers/api/post').create)
  app.post('/1/post/query', require('./controllers/api/post').createByQuery)
  app.put('/1/post/:name/publish', require('./controllers/api/post').activate)
  app.put('/1/post/:name/unpublish', require('./controllers/api/post').inactivate)
  app.delete('/1/post/:id', require('./controllers/api/post').delete)

  app.get('/1/islogin', require('./controllers/api/account').isLogin)

  app.get('/1/account', ensureAuthenticated)
  app.get('/1/account', ensureAccount)
  app.get('/1/account', require('./controllers/api/account').getAccountInfo)

  app.get('/1/user', ensureAuthenticated)
  app.get('/1/user', ensureAccount)
  app.get('/1/user', require('./controllers/api/account').getUserInfo)

  app.all('/1/admin*', ensureAuthenticated)
  app.all('/1/admin*', ensureAdmin)

  app.get('/1/admin/count', require('./controllers/admin/index').init)
  app.get('/1/admin/users', require('./controllers/api/account').adminGetUsers)
  app.get('/1/admin/account/:id', require('./controllers/api/account').adminGetAccountInfo)
  app.get('/1/admin/user/:id', require('./controllers/api/account').admingetUserInfo)
  app.put('/1/admin/account/:id', require('./controllers/admin/accounts').update)
  app.put('/1/admin/user/:id', require('./controllers/admin/users').update)
  app.put('/1/admin/user/:id/password', require('./controllers/admin/users').password)

  // route not found
  // app.all('*', require('./controllers/http/index').http404)
}
