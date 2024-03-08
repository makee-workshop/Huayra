'use strict'

exports = module.exports = function (app, mongoose) {
  var schema = new mongoose.Schema({
    ip: { type: String, default: '' },
    user: { type: String, default: '' },
    time: { type: Date, default: Date.now, expires: app.config.loginAttempts.logExpiration }
  })
  schema.index({ ip: 1 })
  schema.index({ user: 1 })
  schema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('LoginAttempt', schema)
}
