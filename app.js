'use strict'

// dependencies
var config = require('./config')
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var http = require('http')
var path = require('path')
var passport = require('passport')
var mongoose = require('mongoose')
var helmet = require('helmet')
// var csrf = require('csurf')

// create express app
var app = express()

// keep reference to config
app.config = config

// setup the web server
app.server = http.createServer(app)

// setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri)
app.db.on('error', console.error.bind(console, 'mongoose connection error: '))
app.db.once('open', function () {
  // and... we have a data store
})

// config data models
require('./models')(app, mongoose)

// settings
app.disable('x-powered-by')
app.set('port', config.port)
app.set('views', path.join(__dirname, 'controllers'))
app.set('view engine', 'jade')

// middleware
app.use(require('morgan')('dev'))
app.use(require('compression')())
app.use(require('serve-static')(path.join(__dirname, 'build')))
app.use(require('serve-static')(path.join(__dirname, 'public')))
app.use(require('method-override')())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(config.cryptoKey))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.cryptoKey,
  store: new mongoStore({ url: config.mongodb.uri }) // eslint-disable-line
}))
app.use(passport.initialize())
app.use(passport.session())
// app.use(csrf({ cookie: { signed: false } }))
helmet(app)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

// response locals
app.use(function (req, res, next) {
  // res.cookie('_csrfToken', req.csrfToken())
  res.locals.user = {}
  res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl()
  res.locals.user.username = req.user && req.user.username
  next()
})

// global locals
app.locals.projectName = app.config.projectName
app.locals.copyrightYear = new Date().getFullYear()
app.locals.copyrightName = app.config.companyName
app.locals.cacheBreaker = 'br34k-01'

// setup passport
require('./passport')(app, passport)

// setup routes
require('./routes')(app, passport)

// setup react
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'))
})

// custom (friendly) error handler
// app.use(require('./controllers/http/index').http500)

// setup utilities
app.utility = {}
app.utility.sendmail = require('./util/sendmail')
app.utility.slugify = require('./util/slugify')
app.utility.workflow = require('./util/workflow')

// listen up
app.server.listen(app.config.port, function () {
  // and... we're live
  console.log('Server is running on port ' + config.port)
})
