'use strict'

/**
 * @openapi
 * /1/login/forgot/:
 *   post:
 *     tags: [公開]
 *     summary: 寄送密碼重設信
 *     description: 無論 email 是否存在皆回傳成功，避免帳號枚舉。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
exports.send = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.email) {
      workflow.outcome.errfor.email = '請輸入 email。'
      return workflow.emit('response')
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = '請輸入 email。'
    } else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) { // eslint-disable-line
      workflow.outcome.errfor.email = '此 email 格式不正確。'
    }

    workflow.emit('generateToken')
  })

  workflow.on('generateToken', function () {
    const crypto = require('crypto')
    crypto.randomBytes(21, async function (err, buf) {
      if (err) {
        return next(err)
      }

      try {
        const token = buf.toString('hex')
        const hash = await req.app.db.models.User.encryptPassword(token)
        workflow.emit('patchUser', token, hash)
      } catch (err) {
        return next(err)
      }
    })
  })

  workflow.on('patchUser', async function (token, hash) {
    try {
      const conditions = { email: req.body.email.toLowerCase() }
      const fieldsToSet = {
        resetPasswordToken: hash,
        resetPasswordExpires: Date.now() + 10000000
      }
      const user = await req.app.db.models.User.findOneAndUpdate(conditions, fieldsToSet)

      if (!user) {
        return workflow.emit('response')
      }

      workflow.emit('sendEmail', token, user)
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('sendEmail', function (token, user) {
    req.app.utility.sendmail(req, res, {
      from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
      to: user.email,
      subject: '重置' + req.app.config.projectName + '密碼',
      textPath: 'login/forgot/email-text',
      htmlPath: 'login/forgot/email-html',
      locals: {
        username: user.username,
        resetLink: req.protocol + '://' + req.headers.host + '/login/reset/' + user.email + '/' + token + '/',
        projectName: req.app.config.projectName
      },
      success: function (message) {
        workflow.emit('response')
      },
      error: function (err) {
        workflow.outcome.errors.push('Error Sending: ' + err)
        workflow.emit('response')
      }
    })
  })

  workflow.emit('validate')
}
