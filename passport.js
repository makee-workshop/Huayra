'use strict'

exports = module.exports = function (app, passport) {
  const LocalStrategy = require('passport-local').Strategy
  const JwtStrategy = require('passport-jwt').Strategy
  const ExtractJwt = require('passport-jwt').ExtractJwt

  passport.use(new LocalStrategy(
    async function (username, password, done) {
      const conditions = { isActive: true }
      if (username.indexOf('@') === -1) {
        conditions.username = username
      } else {
        conditions.email = username.toLowerCase()
      }

      try {
        const user = await app.db.models.User.findOne(conditions)

        if (!user) {
          return done(null, false, { message: '未知的使用者' })
        }

        const isValid = await app.db.models.User.validatePassword(password, user.password)

        if (!isValid) {
          return done(null, false, { message: '無效的密碼' })
        }

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  ))

  passport.use(new JwtStrategy(
    { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: app.config.secretkey, passReqToCallback: true },
    async (request, jwtPayload, done) => {
      try {
        const user = await app.db.models.User.findById(jwtPayload._id).populate('roles.admin').populate('roles.account')

        if (!user) {
          return done(null, false, { message: 'Unknown user' })
        }

        const token = request.headers.authorization.replace('Bearer ', '')
        if (app.config.expiresIn) {
          const now = new Date().getTime()
          const tokens = user.jwt.filter(j => j.expiredAt > now)
          if (user.jwt.length !== tokens.length) {
            user.jwt = tokens
            await user.save()
          }
        }

        if (user.jwt.filter(j => j.token === token).length === 0) {
          return done(null, false)
        }

        if (user && user.roles && user.roles.admin) {
          await user.roles.admin.populate('groups')
          return done(null, user)
        } else {
          return done(null, user)
        }
      } catch (err) {
        return done(err)
      }
    }
  ))
}
