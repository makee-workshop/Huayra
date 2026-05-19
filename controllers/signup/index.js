'use strict'

exports.signup = function (req, res) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.username) {
      workflow.outcome.errfor.username = '請輸入使用者名稱。'
    } else if (req.body.username.length <= 5) {
      workflow.outcome.errfor.username = '帳號長度不足。'
    } else if (!/^[a-zA-Z0-9\-_]+$/.test(req.body.username)) {
      workflow.outcome.errfor.username = "僅允許大小寫字母、數字、'-' 和 '_'"
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = '請輸入 email。'
    } else if (!/^[a-zA-Z0-9\-_.+]+@[a-zA-Z0-9\-_.]+\.[a-zA-Z0-9\-_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = '此 email 格式不正確。'
    }

    if (!req.body.password) {
      workflow.outcome.errfor.password = '請輸入密碼。'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('duplicateUsernameCheck')
  })

  workflow.on('duplicateUsernameCheck', async function () {
    try {
      const user = await req.app.db.models.User.findOne({ username: req.body.username })

      if (user) {
        workflow.outcome.errfor.username = '該使用者名已被註冊。'
        return workflow.emit('response')
      }

      workflow.emit('duplicateEmailCheck')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('duplicateEmailCheck', async function () {
    try {
      const user = await req.app.db.models.User.findOne({ email: req.body.email.toLowerCase() })

      if (user) {
        workflow.outcome.errfor.email = '該 email 已被註冊。'
        return workflow.emit('response')
      }

      workflow.emit('createUser')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('createUser', async function () {
    try {
      const hash = await req.app.db.models.User.encryptPassword(req.body.password)
      const fieldsToSet = {
        isActive: true,
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: hash,
        search: [
          req.body.username,
          req.body.email
        ]
      }
      workflow.user = await req.app.db.models.User.create(fieldsToSet)
      workflow.emit('createAccount')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('createAccount', async function () {
    const fieldsToSet = {
      isVerified: req.app.config.requireAccountVerification ? 'no' : 'yes',
      'name.full': workflow.user.username,
      user: {
        id: workflow.user._id,
        name: workflow.user.username
      },
      search: [
        workflow.user.username
      ]
    }

    try {
      const account = await req.app.db.models.Account.create(fieldsToSet)
      // update user with account
      workflow.user.roles.account = account._id
      await workflow.user.save()
      workflow.emit('sendWelcomeEmail')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('sendWelcomeEmail', function () {
    req.app.utility.sendmail(req, res, {
      from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
      to: req.body.email,
      subject: 'Your ' + req.app.config.projectName + ' Account',
      textPath: 'signup/email-text',
      htmlPath: 'signup/email-html',
      locals: {
        username: req.body.username,
        email: req.body.email,
        loginURL: req.protocol + '://' + req.headers.host + '/login/',
        projectName: req.app.config.projectName
      },
      success: function (message) {
        workflow.emit('logUserIn')
      },
      error: function (err) {
        console.log('Error Sending Welcome Email: ' + err)
        workflow.emit('logUserIn')
      }
    })
  })

  workflow.on('logUserIn', function () {
    req._passport.instance.authenticate('local', { session: false }, async function (err, user, info) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (!user) {
        workflow.outcome.errors.push('Login failed. That is strange.')
        return workflow.emit('response')
      } else {
        try {
          const token = await user.generateAuthToken()
          workflow.outcome.data = {
            token,
            authenticated: true,
            user: user.username,
            email: user.email,
            role: (user.roles.admin === '' || user.roles.admin === undefined || user.roles.admin === null) ? 'account' : 'admin'
          }

          workflow.emit('response')
        } catch (err) {
          return workflow.emit('exception', err)
        }
      }
    })(req, res)
  })

  workflow.emit('validate')
}
