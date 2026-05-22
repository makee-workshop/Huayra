'use strict'

const sendVerificationEmail = function (req, res, options) {
  req.app.utility.sendmail(req, res, {
    from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
    to: options.email,
    subject: 'Verify Your ' + req.app.config.projectName + ' Account',
    textPath: 'account/verification/email-text',
    htmlPath: 'account/verification/email-html',
    locals: {
      verifyURL: req.protocol + '://' + req.headers.host + '/1/account/verification/' + options.verificationToken + '/',
      projectName: req.app.config.projectName
    },
    success: function () {
      options.onSuccess()
    },
    error: function (err) {
      options.onError(err)
    }
  })
}

exports.init = function (req, res, next) {
  if (req.user.roles.account.isVerified === 'yes') {
    return res.redirect(req.user.defaultReturnUrl())
  }

  const workflow = req.app.utility.workflow(req, res)

  workflow.on('renderPage', async function () {
    try {
      await req.app.db.models.User.findById(req.user.id, 'email')
    } catch (err) {
      return next(err)
    }
  })

  workflow.on('generateTokenOrRender', function () {
    if (req.user.roles.account.verificationToken !== '') {
      return workflow.emit('renderPage')
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
        workflow.emit('patchAccount', token, hash)
      } catch (err) {
        return next(err)
      }
    })
  })

  workflow.on('patchAccount', async function (token, hash) {
    try {
      const fieldsToSet = { verificationToken: hash }
      const options = { new: true }
      await req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, options)

      sendVerificationEmail(req, res, {
        email: req.user.email,
        verificationToken: token,
        onSuccess: function () {
          return workflow.emit('renderPage')
        },
        onError: function (err) {
          return next(err)
        }
      })
    } catch (err) {
      return next(err)
    }
  })

  workflow.emit('generateTokenOrRender')
}

/**
 * @openapi
 * /1/account/verification/:
 *   post:
 *     tags: [帳號]
 *     summary: 重新寄送驗證信（可同時更新 email）
 *     security:
 *       - bearerAuth: []
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
exports.resendVerification = function (req, res, next) {
  if (req.user.roles.account.isVerified === 'yes') {
    return res.redirect(req.user.defaultReturnUrl())
  }

  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required'
    } else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) { // eslint-disable-line
      workflow.outcome.errfor.email = 'invalid email format'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('duplicateEmailCheck')
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
    try {
      const fieldsToSet = { email: req.body.email.toLowerCase() }
      const options = { new: true }
      const user = await req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options)

      workflow.user = user
      workflow.emit('generateToken')
    } catch (err) {
      return workflow.emit('exception', err)
    }
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
        workflow.emit('patchAccount', token, hash)
      } catch (err) {
        return next(err)
      }
    })
  })

  workflow.on('patchAccount', async function (token, hash) {
    try {
      const fieldsToSet = { verificationToken: hash }
      const options = { new: true }
      await req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account.id, fieldsToSet, options)

      sendVerificationEmail(req, res, {
        email: workflow.user.email,
        verificationToken: token,
        onSuccess: function () {
          workflow.emit('response')
        },
        onError: function (err) {
          workflow.outcome.errors.push('Error Sending: ' + err)
          workflow.emit('response')
        }
      })
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('validate')
}

/**
 * @openapi
 * /1/account/verification/{token}/:
 *   get:
 *     tags: [帳號]
 *     summary: 驗證帳號 email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 驗證成功，重導至首頁
 */
exports.verify = async function (req, res, next) {
  try {
    const isValid = await req.app.db.models.User.validatePassword(req.params.token, req.user.roles.account.verificationToken)
    if (!isValid) {
      return res.redirect(req.user.defaultReturnUrl())
    }

    const fieldsToSet = { isVerified: 'yes', verificationToken: '' }
    const options = { new: true }
    await req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account._id, fieldsToSet, options)
    return res.redirect(req.user.defaultReturnUrl())
  } catch (err) {
    return next(err)
  }
}
