'use strict'

exports.set = function (req, res) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.password) {
      workflow.outcome.errfor.password = '請填寫密碼'
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = '請再次填寫密碼'
    }

    if (req.body.password !== req.body.confirm) {
      workflow.outcome.errors.push('兩密碼不吻合')
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('findUser')
  })

  workflow.on('findUser', async function () {
    try {
      const conditions = {
        email: req.params.email,
        resetPasswordExpires: { $gt: Date.now() }
      }
      const user = await req.app.db.models.User.findOne(conditions)

      if (!user) {
        workflow.outcome.errors.push('無效的請求。')
        return workflow.emit('response')
      }

      const isValid = await req.app.db.models.User.validatePassword(req.params.token, user.resetPasswordToken)

      if (!isValid) {
        workflow.outcome.errors.push('無效的請求。')
        return workflow.emit('response')
      }

      workflow.emit('patchUser', user)
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('patchUser', async function (user) {
    try {
      const hash = await req.app.db.models.User.encryptPassword(req.body.password)
      const fieldsToSet = { password: hash, resetPasswordToken: '' }
      const options = { new: true }
      await req.app.db.models.User.findByIdAndUpdate(user._id, fieldsToSet, options)
      workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('validate')
}
