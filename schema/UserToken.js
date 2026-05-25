'use strict'

const crypto = require('crypto')

exports = module.exports = function (app, mongoose) {
  const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    issuedAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, default: null },
    expiresIn: mongoose.Schema.Types.Mixed
  })

  schema.statics.hashToken = function (token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
  schema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('UserToken', schema)
}
