'use strict'

exports.port = process.env.PORT || 3001
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/huayra'
}
exports.companyName = 'Makee'
exports.projectName = 'Huayra'
exports.systemEmail = 'your@email.addy'
exports.cryptoKey = 'k3yb0ardc4t'
exports.secretkey = 'b1ae027d534'
exports.expiresIn = '15 days'
exports.allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
}
exports.swaggerAuth = {
  user: process.env.SWAGGER_USER,
  password: process.env.SWAGGER_PASSWORD
}
exports.apiLimits = {
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 20
  },
  contact: {
    windowMs: 15 * 60 * 1000,
    max: 5
  }
}
exports.requireAccountVerification = false
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName + ' Website',
    address: process.env.SMTP_FROM_ADDRESS || 'your@email.addy'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'your@email.addy',
    password: process.env.SMTP_PASSWORD || 'bl4rg!',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true
  }
}
