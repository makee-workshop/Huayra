'use strict'

/**
 * @openapi
 * /1/contact/:
 *   post:
 *     tags: [公開]
 *     summary: 聯絡表單
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
exports.sendMessage = function (req, res) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.name) {
      workflow.outcome.errfor.name = '請填寫稱呼'
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = '請填寫 email'
    }

    if (!req.body.message) {
      workflow.outcome.errfor.message = '請填寫訊息'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('sendEmail')
  })

  workflow.on('sendEmail', function () {
    req.app.utility.sendmail(req, res, {
      from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
      replyTo: req.body.email,
      to: req.app.config.systemEmail,
      subject: req.app.config.projectName + ' 收到一則訊息',
      textPath: 'contact/email-text',
      htmlPath: 'contact/email-html',
      locals: {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        projectName: req.app.config.projectName
      },
      success: function (message) {
        workflow.emit('response')
      },
      error: function (err) {
        workflow.outcome.errors.push('傳送失敗： ' + err)
        workflow.emit('response')
      }
    })
  })

  workflow.emit('validate')
}
