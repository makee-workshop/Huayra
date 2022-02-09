'use strict'

exports = module.exports = function (app, passport) {
  var LocalStrategy = require('passport-local').Strategy
  var JwtStrategy = require('passport-jwt').Strategy
  var ExtractJwt = require('passport-jwt').ExtractJwt

  passport.use(new LocalStrategy(
    function (username, password, done) {
      var conditions = { isActive: true }
      if (username.indexOf('@') === -1) {
        conditions.username = username
      } else {
        conditions.email = username.toLowerCase()
      }

      app.db.models.User.findOne(conditions, function (err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, { message: '未知的使用者' })
        }

        app.db.models.User.validatePassword(password, user.password, function (err, isValid) {
          if (err) {
            return done(err)
          }

          if (!isValid) {
            return done(null, false, { message: '無效的密碼' })
          }

          return done(null, user)
        })
      })
    }
  ))

  passport.use(new JwtStrategy(
    { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: app.config.secretkey, passReqToCallback: true },
    (request, jwtPayload, done) => {
      app.db.models.User.findById(jwtPayload._id).populate('roles.admin').populate('roles.account').exec(function (err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, { message: 'Unknown user' })
        }

        const token = request.headers.authorization.replace('Bearer ', '')
        if (app.config.expiresIn) {
          var now = new Date().getTime()
          var tokens = user.jwt.filter(j => j.expiredAt > now)
          if (user.jwt.length !== tokens.length) {
            user.jwt = tokens
            user.save()
          }
        }

        if (user.jwt.filter(j => j.token === token).length === 0) {
          done(null, false)
        } else {
          if (user && user.roles && user.roles.admin) {
            user.roles.admin.populate('groups', function (err, admin) {
              done(err, user)
            })
          } else {
            done(err, user)
          }
        }
      })
    }
  ))
}
