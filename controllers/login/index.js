'use strict'

/**
 * @openapi
 * /1/login/:
 *   post:
 *     tags: [公開]
 *     summary: 登入
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AuthSuccess'
 */
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

  workflow.on('abuseFilter', async function () {
    try {
      const conditions = { ip: req.ip }
      const userConditions = { ip: req.ip, user: req.body.username }
      const [ipCount, ipUserCount] = await Promise.all([
        req.app.db.models.LoginAttempt.countDocuments(conditions),
        req.app.db.models.LoginAttempt.countDocuments(userConditions)
      ])

      if (ipCount >= req.app.config.loginAttempts.forIp || ipUserCount >= req.app.config.loginAttempts.forIpAndUser) {
        workflow.outcome.errors.push('登入錯誤次數以超標，請稍後再嘗試。')
        return workflow.emit('response')
      } else {
        workflow.emit('attemptLogin')
      }
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.on('attemptLogin', function () {
    req._passport.instance.authenticate('local', { session: false }, async function (err, user, info) {
      if (err) {
        return workflow.emit('exception', err)
      }

      if (!user) {
        try {
          const fieldsToSet = { ip: req.ip, user: req.body.username }
          await req.app.db.models.LoginAttempt.create(fieldsToSet)

          workflow.outcome.errors.push('此帳號不存在或密碼錯誤。')
          return workflow.emit('response')
        } catch (err) {
          return workflow.emit('exception', err)
        }
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
