'use strict'

const renderSettings = async function (req, res, next, oauthMessage) {
  const outcome = {}

  try {
    const [account, user] = await Promise.all([
      req.app.db.models.Account.findById(req.user.roles.account.id, 'name company phone zip'),
      req.app.db.models.User.findById(req.user.id, 'username email')
    ])
    outcome.account = account
    outcome.user = user
  } catch (err) {
    return next(err)
  }
}

exports.init = function (req, res, next) {
  renderSettings(req, res, next, '')
}

exports.update = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

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

  workflow.on('patchAccount', async function () {
    const reg = /^[\u4E00-\u9FA5]+$/
    let fullName = ''
    if (reg.test(req.body.first + req.body.last)) {
      fullName = req.body.last + req.body.first
    } else {
      fullName = req.body.first + ' ' + req.body.last
    }

    const fieldsToSet = {
      name: {
        first: req.body.first,
        last: req.body.last,
        full: fullName
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
    const options = {
      select: 'name company phone zip',
      new: true
    }
    try {
      const account = await req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, options)
      workflow.outcome.account = account
      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('validate')
}

exports.identity = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

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

  workflow.on('duplicateUsernameCheck', async function () {
    try {
      const user = await req.app.db.models.User.findOne({ username: req.body.username, _id: { $ne: req.user.id } })

      if (user) {
        workflow.outcome.errfor.username = 'username already taken'
        return workflow.emit('response')
      }

      workflow.emit('duplicateEmailCheck')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('duplicateEmailCheck', async function () {
    try {
      const user = await req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.user.id } })

      if (user) {
        workflow.outcome.errfor.email = 'email already taken'
        return workflow.emit('response')
      }

      workflow.emit('patchUser')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('patchUser', async function () {
    const fieldsToSet = {
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      search: [
        req.body.username,
        req.body.email
      ]
    }
    const options = {
      select: 'username email roles',
      new: true
    }
    try {
      const user = await req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options)
      workflow.emit('patchAdmin', user)
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('patchAdmin', async function (user) {
    if (user.roles.admin) {
      const fieldsToSet = {
        user: {
          id: req.user.id,
          name: user.username
        }
      }
      const options = { new: true }
      try {
        await req.app.db.models.Admin.findByIdAndUpdate(user.roles.admin, fieldsToSet, options)
        workflow.emit('patchAccount', user)
      } catch (err) {
        return workflow.emit('exception', err)
      }
    } else {
      workflow.emit('patchAccount', user)
    }
  })

  workflow.on('patchAccount', async function (user) {
    if (user.roles.account) {
      const fieldsToSet = {
        user: {
          id: req.user.id,
          name: user.username
        }
      }
      const options = { new: true }
      try {
        await req.app.db.models.Account.findByIdAndUpdate(user.roles.account, fieldsToSet, options)
        workflow.emit('populateRoles', user)
      } catch (err) {
        return workflow.emit('exception', err)
      }
    } else {
      workflow.emit('populateRoles', user)
    }
  })

  workflow.on('populateRoles', async function (user) {
    try {
      const populatedUser = await user.populate('roles.admin roles.account', 'name.full')
      workflow.outcome.user = populatedUser
      workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('validate')
}

exports.password = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.newPassword) {
      workflow.outcome.errfor.newPassword = '請輸入新密碼'
    } else if (req.body.newPassword.length < 8) {
      workflow.outcome.errfor.newPassword = '密碼長度至少需要 8 個字元'
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

  workflow.on('patchUser', async function () {
    try {
      const hash = await req.app.db.models.User.encryptPassword(req.body.newPassword)
      const fieldsToSet = { password: hash }
      const options = { new: true }
      const user = await req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options)
      await user.populate('roles.admin roles.account', 'name.full')

      workflow.outcome.newPassword = ''
      workflow.outcome.confirm = ''
      workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('validate')
}
