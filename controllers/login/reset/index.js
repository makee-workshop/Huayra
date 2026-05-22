'use strict'

/**
 * @openapi
 * /1/login/reset/{email}/{token}/:
 *   put:
 *     tags: [公開]
 *     summary: 重設密碼
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, confirm]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirm:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
exports.set = function (req, res) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.password) {
      workflow.outcome.errfor.password = '請填寫密碼'
    } else if (req.body.password.length < 8) {
      workflow.outcome.errfor.password = '密碼長度至少需要 8 個字元'
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
