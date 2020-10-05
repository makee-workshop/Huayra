'use strict'
var jwt = require('jsonwebtoken')
var ms = require('ms')

exports = module.exports = function (app, mongoose) {
  var userSchema = new mongoose.Schema({
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
    jwt: [{
      _id: false,
      token: { type: String },
      expiredAt: { type: Number }
    }],
    search: [String]
  })
  userSchema.methods.canPlayRoleOf = function (role) {
    if (role === 'admin' && this.roles.admin) {
      return true
    }

    if (role === 'account' && this.roles.account) {
      return true
    }

    return false
  }
  userSchema.methods.defaultReturnUrl = function () {
    var returnUrl = '/'
    if (this.canPlayRoleOf('account')) {
      returnUrl = '/account/'
    }

    if (this.canPlayRoleOf('admin')) {
      returnUrl = '/admin/'
    }

    return returnUrl
  }
  userSchema.statics.encryptPassword = function (password, done) {
    var bcrypt = require('bcrypt')
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return done(err)
      }

      bcrypt.hash(password, salt, function (err, hash) {
        done(err, hash)
      })
    })
  }
  userSchema.statics.validatePassword = function (password, hash, done) {
    var bcrypt = require('bcrypt')
    bcrypt.compare(password, hash, function (err, res) {
      done(err, res)
    })
  }
  userSchema.methods.generateAuthToken = function () {
    var opt = {}
    var expiredAt = 0
    if (app.config.expiresIn) {
      opt = { expiresIn: app.config.expiresIn }
      if (typeof (app.config.expiresIn) === 'string') {
        expiredAt = ms(app.config.expiresIn)
      } else if (typeof (app.config.expiresIn) === 'number') {
        expiredAt = app.config.expiresIn
      }
      expiredAt = new Date().getTime() + expiredAt
    }
    var token = jwt.sign({
      _id: this._doc._id,
      username: this._doc.username,
      email: this._doc.email,
      roles: this._doc.roles
    }, app.config.secretkey,
    opt)

    this.jwt = this.jwt.concat({
      token: token,
      expiredAt: expiredAt
    })
    this.save()
    return token
  }
  userSchema.plugin(require('./plugins/pagedFind'))
  userSchema.index({ username: 1 }, { unique: true })
  userSchema.index({ email: 1 }, { unique: true })
  userSchema.index({ timeCreated: 1 })
  userSchema.index({ search: 1 })
  userSchema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('User', userSchema)
}
