'use strict'
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const config = require('./config')

const limiterDefaults = { standardHeaders: true, legacyHeaders: false }
const authLimiter = rateLimit({ ...config.apiLimits.auth, ...limiterDefaults })
const contactLimiter = rateLimit({ ...config.apiLimits.contact, ...limiterDefaults })

const ensureAuthenticated = passport.authenticate('jwt', { session: false })

function ensureAccount (req, res, next) {
  if (req.user.canPlayRoleOf('account')) {
    if (req.app.config.requireAccountVerification) {
      if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/1/account/verification/')
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
  app.post('/1/contact/', contactLimiter, require('./controllers/contact/index').sendMessage)

  // sign up
  app.post('/1/signup/', authLimiter, require('./controllers/signup/index').signup)

  // login/out
  app.post('/1/login/', authLimiter, require('./controllers/login/index').login)
  app.post('/1/login/forgot/', authLimiter, require('./controllers/login/forgot/index').send)
  app.put('/1/login/reset/:email/:token/', require('./controllers/login/reset/index').set)

  app.all('/:prefix/account{/*path}', ensureAuthenticated)
  app.all('/:prefix/account{/*path}', ensureAccount)
  app.all('/:prefix/admin{/*path}', ensureAuthenticated)
  app.all('/:prefix/admin{/*path}', ensureAdmin)

  // account > verification
  app.post('/1/account/verification/', require('./controllers/account/verification/index').resendVerification)
  app.get('/1/account/verification/:token/', require('./controllers/account/verification/index').verify)

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

  app.get('/1/account', require('./controllers/account/index').getAccountInfo)
  app.get('/1/account/user', require('./controllers/account/index').getUserInfo)

  app.get('/1/admin/count', require('./controllers/admin/index').init)
  app.get('/1/admin/users', require('./controllers/account/index').adminGetUsers)
  app.get('/1/admin/account/:id', require('./controllers/account/index').adminGetAccountInfo)
  app.get('/1/admin/user/:id', require('./controllers/account/index').admingetUserInfo)
  app.put('/1/admin/account/:id', require('./controllers/admin/accounts').update)
  app.put('/1/admin/user/:id', require('./controllers/admin/users').update)
  app.put('/1/admin/user/:id/password', require('./controllers/admin/users').password)
  app.delete('/1/admin/users/:id', require('./controllers/admin/users').delete)
  app.post('/1/admin/signup/', require('./controllers/admin/users').signup)

  // route not found
  // app.all('*', require('./controllers/http/index').http404)
}
