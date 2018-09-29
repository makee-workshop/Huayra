'use strict'

var renderSettings = function (req, res, next, oauthMessage) {
  var outcome = {}

  var getAccountData = function (callback) {
    req.app.db.models.Account.findById(req.user.roles.account.id, 'name company phone zip').exec(function (err, account) {
      if (err) {
        return callback(err, null)
      }

      outcome.account = account
      callback(null, 'done')
    })
  }

  var getUserData = function (callback) {
    req.app.db.models.User.findById(req.user.id, 'username email').exec(function (err, user) {
      if (err) {
        callback(err, null)
      }

      outcome.user = user
      return callback(null, 'done')
    })
  }

  var asyncFinally = function (err, results) {
    if (err) {
      return next(err)
    }
  }

  require('async').parallel([getAccountData, getUserData], asyncFinally)
}

exports.init = function (req, res, next) {
  renderSettings(req, res, next, '')
}

exports.update = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.first) {
      workflow.outcome.errfor.first = '請填寫名字'
    }

    if (!req.body.last) {
      workflow.outcome.errfor.last = '請填寫姓氏'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('patchAccount')
  })

  workflow.on('patchAccount', function () {
    var fieldsToSet = {
      name: {
        first: req.body.first,
        last: req.body.last,
        full: req.body.last + req.body.first
      },
      company: req.body.company,
      phone: req.body.phone,
      zip: req.body.zip,
      search: [
        req.body.first,
        req.body.middle,
        req.body.last,
        req.body.company,
        req.body.phone,
        req.body.zip
      ]
    }
    var options = {
      select: 'name company phone zip',
      new: true
    }
    req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, options, function (err, account) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.outcome.account = account
      return workflow.emit('response')
    })
  })

  workflow.emit('validate')
}

exports.identity = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.username) {
      workflow.outcome.errfor.username = '請輸入帳號'
    } else if (!/^[a-zA-Z0-9\-\_]+$/.test(req.body.username)) { // eslint-disable-line
      workflow.outcome.errfor.username = "帳號僅能使用英文、數字、'-'、'_'"
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = '請輸入 email'
    } else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) { // eslint-disable-line
      workflow.outcome.errfor.email = 'email 格式錯誤'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('duplicateUsernameCheck')
  })

  workflow.on('duplicateUsernameCheck', function () {
    req.app.db.models.User.findOne({ username: req.body.username, _id: { $ne: req.user.id } }, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (user) {
        workflow.outcome.errfor.username = 'username already taken'
        return workflow.emit('response')
      }

      workflow.emit('duplicateEmailCheck')
    })
  })

  workflow.on('duplicateEmailCheck', function () {
    req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.user.id } }, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (user) {
        workflow.outcome.errfor.email = 'email already taken'
        return workflow.emit('response')
      }

      workflow.emit('patchUser')
    })
  })

  workflow.on('patchUser', function () {
    var fieldsToSet = {
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      search: [
        req.body.username,
        req.body.email
      ]
    }
    var options = {
      select: 'username email',
      new: true
    }
    req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.emit('patchAdmin', user)
    })
  })

  workflow.on('patchAdmin', function (user) {
    if (user.roles.admin) {
      var fieldsToSet = {
        user: {
          id: req.user.id,
          name: user.username
        }
      }
      var options = { new: true }
      req.app.db.models.Admin.findByIdAndUpdate(user.roles.admin, fieldsToSet, options, function (err, admin) {
        if (err) {
          return workflow.emit('exception', err)
        }

        workflow.emit('patchAccount', user)
      })
    } else {
      workflow.emit('patchAccount', user)
    }
  })

  workflow.on('patchAccount', function (user) {
    if (user.roles.account) {
      var fieldsToSet = {
        user: {
          id: req.user.id,
          name: user.username
        }
      }
      var options = { new: true }
      req.app.db.models.Account.findByIdAndUpdate(user.roles.account, fieldsToSet, options, function (err, account) {
        if (err) {
          return workflow.emit('exception', err)
        }

        workflow.emit('populateRoles', user)
      })
    } else {
      workflow.emit('populateRoles', user)
    }
  })

  workflow.on('populateRoles', function (user) {
    user.populate('roles.admin roles.account', 'name.full', function (err, populatedUser) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.outcome.user = populatedUser
      workflow.emit('response')
    })
  })

  workflow.emit('validate')
}

exports.password = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.newPassword) {
      workflow.outcome.errfor.newPassword = '請輸入新密碼'
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = '請次次輸入新密碼'
    }

    if (req.body.newPassword !== req.body.confirm) {
      workflow.outcome.errors.push('兩密碼不相同')
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('patchUser')
  })

  workflow.on('patchUser', function () {
    req.app.db.models.User.encryptPassword(req.body.newPassword, function (err, hash) {
      if (err) {
        return workflow.emit('exception', err)
      }

      var fieldsToSet = { password: hash }
      var options = { new: true }
      req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options, function (err, user) {
        if (err) {
          return workflow.emit('exception', err)
        }

        user.populate('roles.admin roles.account', 'name.full', function (err, user) {
          if (err) {
            return workflow.emit('exception', err)
          }

          workflow.outcome.newPassword = ''
          workflow.outcome.confirm = ''
          workflow.emit('response')
        })
      })
    })
  })

  workflow.emit('validate')
}
