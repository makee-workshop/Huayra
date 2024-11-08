'use strict'

exports.update = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  let userObj = null
  let adminId = ''

  workflow.on('validate', function () {
    req.body.isActive = req.body.isActive === 'true'

    if (!req.body.username) {
      workflow.outcome.errfor.username = '請輸入使用者名稱。'
    } else if (!/^[a-zA-Z0-9-_]+$/.test(req.body.username)) {
      workflow.outcome.errfor.username = "僅允許大小寫字母、數字、'-' 和 '_'"
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = '請輸入 email。'
    } else if (!/^[a-zA-Z0-9\-_.+]+@[a-zA-Z0-9\-_.]+\.[a-zA-Z0-9\-_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = '此 email 格式不正確。'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('getUser')
  })

  workflow.on('getUser', function () {
    req.app.db.models.User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      userObj = user

      if (req.body.roles === 'admin' && !user.roles.admin) {
        return workflow.emit('setAdmin', user)
      } else {
        return workflow.emit('duplicateUsernameCheck')
      }
    })
  })

  workflow.on('setAdmin', function (userObj) {
    const fieldsToSet = {
      user: {
        id: userObj._id,
        name: userObj.username
      },
      name: {
        last: userObj.username
      },
      groups: ['root']
    }

    req.app.db.models.Admin.findOneAndUpdate(
      { user: { id: userObj._id } },
      fieldsToSet,
      { safe: true, upsert: true, new: true },
      function (err, admin) {
        if (err) return workflow.emit('exception', err)

        if (admin) {
          adminId = admin._id
        }

        return workflow.emit('duplicateUsernameCheck')
      })
  })

  workflow.on('duplicateUsernameCheck', function () {
    req.app.db.models.User.findOne({ username: req.body.username, _id: { $ne: req.params.id } }, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (user) {
        workflow.outcome.errfor.username = 'username already taken'
        return workflow.emit('response')
      } else {
        return workflow.emit('duplicateEmailCheck')
      }
    })
  })

  workflow.on('duplicateEmailCheck', function () {
    req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.params.id } }, function (err, user) {
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
    const fieldsToSet = {
      isActive: req.body.isActive,
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      search: [
        req.body.username,
        req.body.email
      ]
    }

    if (req.body.roles === 'admin' && !userObj.roles.admin) {
      fieldsToSet.roles = {
        admin: adminId,
        account: userObj.roles.account
      }
    } else if (req.body.roles === 'account') {
      fieldsToSet.roles = {
        account: userObj.roles.account
      }
    }

    const options = { new: true }
    req.app.db.models.User.findByIdAndUpdate(req.params.id, fieldsToSet, options, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.emit('patchAdmin', user)
    })
  })

  workflow.on('patchAdmin', function (user) {
    if (user.roles.admin) {
      const fieldsToSet = {
        user: {
          id: req.params.id,
          name: user.username
        }
      }
      const options = { new: true }
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
      const fieldsToSet = {
        user: {
          id: req.params.id,
          name: user.username
        }
      }
      const options = { new: true }
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
      if (req.body.roles === 'account') {
        workflow.emit('deleteAdmin')
      } else {
        workflow.emit('response')
      }
    })
  })

  workflow.on('deleteAdmin', function () {
    req.app.db.models.Admin.findOneAndRemove({ 'user.id': req.params.id }, function (err, admin) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.emit('response')
    })
  })

  workflow.emit('validate')
}

exports.password = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.newPassword) {
      workflow.outcome.errfor.newPassword = '請填寫新密碼'
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = '請再次填寫新密碼'
    }

    if (req.body.newPassword !== req.body.confirm) {
      workflow.outcome.errors.push('兩密碼內容不相同')
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

      const fieldsToSet = { password: hash }
      const options = { new: true }
      req.app.db.models.User.findByIdAndUpdate(req.params.id, fieldsToSet, options, function (err, user) {
        if (err) {
          return workflow.emit('exception', err)
        }

        user.populate('roles.admin roles.account', 'name.full', function (err, user) {
          if (err) {
            return workflow.emit('exception', err)
          }

          workflow.outcome.user = user
          workflow.outcome.newPassword = ''
          workflow.outcome.confirm = ''
          workflow.emit('response')
        })
      })
    })
  })

  workflow.emit('validate')
}

exports.delete = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('您無法刪除使用者。')
      return workflow.emit('response')
    }

    if (req.user._id === req.params.id) {
      workflow.outcome.errors.push('您無法刪除自己。')
      return workflow.emit('response')
    }

    workflow.emit('deleteUser')
  })

  workflow.on('deleteUser', function () {
    req.app.db.models.User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (user.roles.account) {
        workflow.emit('deleteAccount', user.roles.account)
      } else {
        workflow.emit('deleteAdmin')
      }
    })
  })

  workflow.on('deleteAccount', function (accountId) {
    req.app.db.models.Account.findByIdAndRemove(accountId, function (err, account) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.emit('deleteAdmin')
    })
  })

  workflow.on('deleteAdmin', function () {
    req.app.db.models.Admin.findOneAndRemove({ 'user.id': req.params.id }, function (err, admin) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.emit('response')
    })
  })

  workflow.emit('validate')
}

exports.signup = function (req, res) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = '請填寫 email'
    } else if (!/^[a-zA-Z0-9\-_.+]+@[a-zA-Z0-9\-_.]+\.[a-zA-Z0-9\-_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = 'email 格式錯誤'
    }

    if (!req.body.username) {
      workflow.outcome.errfor.username = '請填寫帳號'
    } else if (req.body.username.length <= 5) {
      workflow.outcome.errfor.username = '帳號長度不足'
    } else if (!/^[a-zA-Z0-9\-_]+$/.test(req.body.username)) {
      workflow.outcome.errfor.username = "僅允許大小寫字母、數字、'-' 和 '_'"
    }

    if (!req.body.password) {
      workflow.outcome.errfor.password = '請填寫密碼'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('duplicateUsernameCheck')
  })

  workflow.on('duplicateUsernameCheck', function () {
    req.app.db.models.User.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (user) {
        workflow.outcome.errfor.username = '此帳號已被使用'
        return workflow.emit('response')
      }

      workflow.emit('duplicateEmailCheck')
    })
  })

  workflow.on('duplicateEmailCheck', function () {
    req.app.db.models.User.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (user) {
        workflow.outcome.errfor.email = '此 email 已被使用'
        return workflow.emit('response')
      }

      workflow.emit('createUser')
    })
  })

  workflow.on('createUser', function () {
    req.app.db.models.User.encryptPassword(req.body.password, function (err, hash) {
      if (err) {
        return workflow.emit('exception', err)
      }

      const fieldsToSet = {
        isActive: 'yes',
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: hash,
        search: [
          req.body.username,
          req.body.email
        ]
      }

      if (req.body.isActive) {
        fieldsToSet.isActive = req.body.isActive.trim() === 'yes' ? 'yes' : 'no'
      }

      req.app.db.models.User.create(fieldsToSet, function (err, user) {
        if (err) {
          return workflow.emit('exception', err)
        }

        workflow.user = user
        workflow.emit('createAccount')
      })
    })
  })

  workflow.on('createAccount', function () {
    const fieldsToSet = {
      isVerified: req.app.get('require-account-verification') ? 'no' : 'yes',
      'name.full': workflow.user.username,
      user: {
        id: workflow.user._id,
        name: workflow.user.username
      },
      search: [
        workflow.user.username
      ]
    }

    req.app.db.models.Account.create(fieldsToSet, function (err, account) {
      if (err) {
        return workflow.emit('exception', err)
      }

      // update user with account
      workflow.user.roles.account = account._id
      workflow.user.save(function (err, user) {
        if (err) {
          return workflow.emit('exception', err)
        }

        workflow.emit('response')
      })
    })
  })

  workflow.emit('validate')
}
