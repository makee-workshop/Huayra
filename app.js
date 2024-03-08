'use strict'

// dependencies
const config = require('./config')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const passport = require('passport')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
// var csrf = require('csurf')

// create express app
const app = express()

// keep reference to config
app.config = config

// setup the web server
app.server = http.createServer(app)

// setup mongoose
const mongoConnectSetting = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
mongoose.connect(config.mongodb.uri, mongoConnectSetting)
app.db = mongoose.connection

app.db.on('error', function (error) {
  console.error('Error in MongoDb connection: ' + error)
  mongoose.disconnect()
})

app.db.on('disconnected', function () {
  console.log('MongoDB disconnected!')
  mongoose.connect(config.mongodb.uri, mongoConnectSetting)
})

// config data models
require('./models')(app, mongoose)

// settings
app.disable('x-powered-by')
app.set('port', config.port)
app.set('views', path.join(__dirname, 'controllers'))
app.set('view engine', 'pug')

// middleware
app.use(require('morgan')('dev'))
app.use(require('compression')())
app.use(require('serve-static')(path.join(__dirname, 'build')))
app.use(require('serve-static')(path.join(__dirname, 'public')))
app.use(require('method-override')())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(config.cryptoKey))
app.use(passport.initialize())
app.use(cors())
// app.use(csrf({ cookie: { signed: false } }))
helmet(app)

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
app.utility.ODMService = require('./util/odm-service')

// listen up
app.server.listen(app.config.port, function () {
  // and... we're live
  console.log('Server is running on port ' + config.port)
})
