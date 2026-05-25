'use strict'
const jwt = require('jsonwebtoken')
const ms = require('ms')

const hasExpiresIn = function (expiresIn) {
  return expiresIn !== undefined && expiresIn !== null && expiresIn !== ''
}

const buildJwtOptions = function (expiresIn) {
  return hasExpiresIn(expiresIn) ? { expiresIn } : {}
}

const buildExpiresAt = function (expiresIn, issuedAt) {
  if (!hasExpiresIn(expiresIn)) {
    return null
  }

  if (typeof (expiresIn) === 'string') {
    return new Date(issuedAt.getTime() + ms(expiresIn))
  }

  if (typeof (expiresIn) === 'number') {
    return new Date(issuedAt.getTime() + expiresIn * 1000)
  }

  return null
}

exports = module.exports = function (app, mongoose) {
  const schema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    roles: {
      admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
    },
    isActive: { type: Boolean, default: true },
    timeCreated: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    search: [String]
  })
  schema.methods.canPlayRoleOf = function (role) {
    if (role === 'admin' && this.roles.admin) {
      return true
    }

    if (role === 'account' && this.roles.account) {
      return true
    }

    return false
  }
  schema.methods.defaultReturnUrl = function () {
    let returnUrl = '/'
    if (this.canPlayRoleOf('account')) {
      returnUrl = '/account/'
    }

    if (this.canPlayRoleOf('admin')) {
      returnUrl = '/admin/'
    }

    return returnUrl
  }
  schema.statics.encryptPassword = async function (password) {
    const bcrypt = require('bcrypt')
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }
  schema.statics.validatePassword = function (password, hash) {
    const bcrypt = require('bcrypt')
    return bcrypt.compare(password, hash)
  }
  schema.methods.generateAuthToken = async function () {
    const issuedAt = new Date()
    const expiresIn = app.config.expiresIn
    const token = jwt.sign({
      _id: this._doc._id,
      username: this._doc.username,
      email: this._doc.email,
      roles: this._doc.roles
    }, app.config.secretkey,
    buildJwtOptions(expiresIn))

    await app.db.models.UserToken.create({
      user: this._id,
      tokenHash: app.db.models.UserToken.hashToken(token),
      issuedAt,
      expiresAt: buildExpiresAt(expiresIn, issuedAt),
      expiresIn: hasExpiresIn(expiresIn) ? expiresIn : null
    })

    return token
  }
  schema.plugin(require('./plugins/pagedFind'))
  schema.index({ timeCreated: 1 })
  schema.index({ search: 1 })
  schema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('User', schema)
}
