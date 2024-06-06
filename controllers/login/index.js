'use strict'

exports.login = function (req, res) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.username) {
      workflow.outcome.errfor.username = '請輸入帳號。'
    }

    if (!req.body.password) {
      workflow.outcome.errfor.password = '請輸入密碼。'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('abuseFilter')
  })

  workflow.on('abuseFilter', function () {
    const getIpCount = function (done) {
      const conditions = { ip: req.ip }
      req.app.db.models.LoginAttempt.countDocuments(conditions, function (err, count) {
        if (err) {
          return done(err)
        }

        done(null, count)
      })
    }

    const getIpUserCount = function (done) {
      const conditions = { ip: req.ip, user: req.body.username }
      req.app.db.models.LoginAttempt.countDocuments(conditions, function (err, count) {
        if (err) {
          return done(err)
        }

        done(null, count)
      })
    }

    const asyncFinally = function (err, results) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (results.ip >= req.app.config.loginAttempts.forIp || results.ipUser >= req.app.config.loginAttempts.forIpAndUser) {
        workflow.outcome.errors.push('登入錯誤次數以超標，請稍後再嘗試。')
        return workflow.emit('response')
      } else {
        workflow.emit('attemptLogin')
      }
    }

    require('async').parallel({ ip: getIpCount, ipUser: getIpUserCount }, asyncFinally)
  })

  workflow.on('attemptLogin', function () {
    req._passport.instance.authenticate('local', { session: false }, function (err, user, info) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (!user) {
        const fieldsToSet = { ip: req.ip, user: req.body.username }
        req.app.db.models.LoginAttempt.create(fieldsToSet, function (err, doc) {
          if (err) {
            return workflow.emit('exception', err)
          }

          workflow.outcome.errors.push('此帳號不存在或密碼錯誤。')
          return workflow.emit('response')
        })
      } else {
        workflow.outcome.data = {
          token: user.generateAuthToken(),
          authenticated: true,
          user: user.username,
          email: user.email,
          role: (user.roles.admin === '' || user.roles.admin === undefined || user.roles.admin === null) ? 'account' : 'admin'
        }

        workflow.emit('response')
      }
    })(req, res)
  })

  workflow.emit('validate')
}
