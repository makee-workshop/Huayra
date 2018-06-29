'use strict'

exports.port = process.env.PORT || 3001
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/huayra'
}
exports.companyName = 'Makee'
exports.projectName = 'Huayra'
exports.systemEmail = 'your@email.addy'
exports.cryptoKey = 'k3yb0ardc4t'
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
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
