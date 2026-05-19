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

  workflow.on('getUser', async function () {
    try {
      const user = await req.app.db.models.User.findById(req.params.id)

      userObj = user

      if (req.body.roles === 'admin' && !user.roles.admin) {
        return workflow.emit('setAdmin', user)
      } else {
        return workflow.emit('duplicateUsernameCheck')
      }
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('setAdmin', async function (userObj) {
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

    try {
      const admin = await req.app.db.models.Admin.findOneAndUpdate(
        { user: { id: userObj._id } },
        fieldsToSet,
        { upsert: true, new: true }
      )

      if (admin) {
        adminId = admin._id
      }

      return workflow.emit('duplicateUsernameCheck')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('duplicateUsernameCheck', async function () {
    try {
      const user = await req.app.db.models.User.findOne({ username: req.body.username, _id: { $ne: req.params.id } })

      if (user) {
        workflow.outcome.errfor.username = 'username already taken'
        return workflow.emit('response')
      } else {
        return workflow.emit('duplicateEmailCheck')
      }
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('duplicateEmailCheck', async function () {
    try {
      const user = await req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.params.id } })

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
    try {
      const user = await req.app.db.models.User.findByIdAndUpdate(req.params.id, fieldsToSet, options)
      workflow.emit('patchAdmin', user)
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('patchAdmin', async function (user) {
    if (user.roles.admin) {
      const fieldsToSet = {
        user: {
          id: req.params.id,
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
          id: req.params.id,
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
      if (req.body.roles === 'account') {
        workflow.emit('deleteAdmin')
      } else {
        workflow.emit('response')
      }
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('deleteAdmin', async function () {
    try {
      await req.app.db.models.Admin.findOneAndDelete({ 'user.id': req.params.id })
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

  workflow.on('patchUser', async function () {
    try {
      const hash = await req.app.db.models.User.encryptPassword(req.body.newPassword)
      const fieldsToSet = { password: hash }
      const options = { new: true }
      const user = await req.app.db.models.User.findByIdAndUpdate(req.params.id, fieldsToSet, options)
      await user.populate('roles.admin roles.account', 'name.full')

      workflow.outcome.user = user
      workflow.outcome.newPassword = ''
      workflow.outcome.confirm = ''
      workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
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

  workflow.on('deleteUser', async function () {
    try {
      const user = await req.app.db.models.User.findByIdAndDelete(req.params.id)

      if (user.roles.account) {
        workflow.emit('deleteAccount', user.roles.account)
      } else {
        workflow.emit('deleteAdmin')
      }
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('deleteAccount', async function (accountId) {
    try {
      await req.app.db.models.Account.findByIdAndDelete(accountId)
      workflow.emit('deleteAdmin')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('deleteAdmin', async function () {
    try {
      await req.app.db.models.Admin.findOneAndDelete({ 'user.id': req.params.id })
      workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
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

  workflow.on('duplicateUsernameCheck', async function () {
    try {
      const user = await req.app.db.models.User.findOne({ username: req.body.username })

      if (user) {
        workflow.outcome.errfor.username = '此帳號已被使用'
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
        workflow.outcome.errfor.email = '此 email 已被使用'
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

      workflow.user = await req.app.db.models.User.create(fieldsToSet)
      workflow.emit('createAccount')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('createAccount', async function () {
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

    try {
      const account = await req.app.db.models.Account.create(fieldsToSet)
      // update user with account
      workflow.user.roles.account = account._id
      await workflow.user.save()
      workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('validate')
}
