'use strict'

exports = module.exports = function (req, res, options) {
  /* options = {
    from: String,
    to: String,
    cc: String,
    bcc: String,
    text: String,
    textPath String,
    html: String,
    htmlPath: String,
    attachments: [String],
    success: Function,
    error: Function
  } */

  const renderText = function (callback) {
    res.render(options.textPath, options.locals, function (err, text) {
      if (err) {
        callback(err, null)
      } else {
        options.text = text
        return callback(null, 'done')
      }
    })
  }

  const renderHtml = function (callback) {
    res.render(options.htmlPath, options.locals, function (err, html) {
      if (err) {
        callback(err, null)
      } else {
        options.html = html
        return callback(null, 'done')
      }
    })
  }

  const renderers = []
  if (options.textPath) {
    renderers.push(renderText)
  }

  if (options.htmlPath) {
    renderers.push(renderHtml)
  }

  require('async').parallel(
    renderers,
    function (err, results) {
      if (err) {
        options.error('Email 樣版渲染失敗。 ' + err)
        return
      }

      const attachments = []

      if (options.html) {
        attachments.push({ data: options.html, alternative: true })
      }

      if (options.attachments) {
        for (let i = 0; i < options.attachments.length; i++) {
          attachments.push(options.attachments[i])
        }
      }

      const SMTPClient = require('emailjs').SMTPClient
      const emailer = new SMTPClient(req.app.config.smtp.credentials)
      emailer.send({
        from: options.from,
        to: options.to,
        'reply-to': options.replyTo || options.from,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        attachment: attachments
      }, function (err, message) {
        if (err) {
          options.error('Email 寄送失敗。 ' + err)
        } else {
          options.success(message)
        }
      })
    }
  )
}
