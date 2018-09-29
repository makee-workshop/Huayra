'use strict'

exports.isLogin = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line

  workflow.on('validate', function () {
    var isLogin = {
      authenticated: false,
      role: ''
    }

    if (req.user) {
      isLogin = {
        authenticated: true,
        user: req.user.username,
        email: req.user.email,
        role: (req.user.roles.admin === '' ||
        req.user.roles.admin === undefined ||
        req.user.roles.admin === null) ? 'account' : 'admin'
      }
    }

    workflow.outcome.data = isLogin

    return workflow.emit('response')
  })

  return workflow.emit('validate')
}

exports.getAccountInfo = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  workflow.outcome.data = {}

  req.app.db.models.Account.findById(req.user.roles.account.id, 'name company phone zip').exec(function (err, account) {
    if (err) {
      return callback(err, null)
    }

    workflow.outcome.data = account
    return workflow.emit('response')
  })
}

exports.getUserInfo = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  workflow.outcome.data = {}

  req.app.db.models.User.findById(req.user.id, 'username email').exec(function (err, user) {
    if (err) {
      callback(err, null)
    }

    workflow.outcome.data = user
    return workflow.emit('response')
  })
}
