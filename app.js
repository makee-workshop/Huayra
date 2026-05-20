'use strict'

// dependencies
const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const passport = require('passport')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

// create express app
const app = express()

// keep reference to config
app.config = config

// setup the web server
app.server = http.createServer(app)

// setup mongoose
app.db = mongoose.connection

app.db.on('error', function (error) {
  console.error('Error in MongoDb connection: ' + error)
})

app.db.on('disconnected', function () {
  console.log('MongoDB disconnected!')
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
app.use(passport.initialize())
app.use(cors({ origin: config.allowedOrigins, credentials: true }))
app.use(helmet())
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body)
  if (req.params) req.params = mongoSanitize.sanitize(req.params)
  next()
})

// response locals
app.use(function (req, res, next) {
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
app.get('*path', function (req, res) {
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

const shutdownTimeoutMs = 10000
let isShuttingDown = false

const startServer = async function () {
  await mongoose.connect(config.mongodb.uri)

  await new Promise(function (resolve, reject) {
    app.server.once('error', reject)

    app.server.listen(app.config.port, function () {
      app.server.off('error', reject)

      // and... we're live
      console.log('Server is running on port ' + config.port)
      resolve()
    })
  })
}

const closeServer = function () {
  return new Promise(function (resolve, reject) {
    app.server.close(function (err) {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

const shutdown = async function (signal) {
  if (isShuttingDown) {
    console.log('Shutdown already in progress, ignoring ' + signal)
    return
  }

  isShuttingDown = true
  console.log('Received ' + signal + ', shutting down gracefully')

  const timeout = setTimeout(function () {
    console.error('Graceful shutdown timed out after ' + shutdownTimeoutMs + 'ms')
    process.exit(1)
  }, shutdownTimeoutMs)

  try {
    await closeServer()
    console.log('HTTP server closed')

    await mongoose.disconnect()
    console.log('MongoDB disconnected')

    clearTimeout(timeout)
    process.exit(0)
  } catch (err) {
    clearTimeout(timeout)
    console.error('Failed to shutdown gracefully:', err)
    process.exit(1)
  }
}

process.on('SIGTERM', function () {
  shutdown('SIGTERM')
})

process.on('SIGINT', function () {
  shutdown('SIGINT')
})

startServer().catch(function (err) {
  console.error('Failed to start server:', err)
  process.exit(1)
})
