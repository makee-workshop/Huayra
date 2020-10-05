'use strict'

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

exports.adminGetAccountInfo = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  var aid = req.params.id
  workflow.outcome.data = {}

  req.app.db.models.Account.findById(aid).exec(function (err, account) {
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

exports.admingetUserInfo = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  var uid = req.params.id
  workflow.outcome.data = {}

  req.app.db.models.User.findById(uid, 'username email isActive roles').exec(function (err, user) {
    if (err) {
      callback(err, null)
    }

    workflow.outcome.data = user
    return workflow.emit('response')
  })
}

exports.adminGetUsers = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line

  req.query.limit = req.query.limit ? parseInt(req.query.limit) : 10
  req.query.page = req.query.page ? parseInt(req.query.page) : 1
  req.query.sort = req.query.sort ? req.query.sort : '-timeCreated'

  workflow.on('listUsers', function () {
    req.app.db.models.User.pagedFind({
      limit: req.query.limit,
      sort: req.query.sort,
      populateKey: 'roles.account',
      populateFor: 'name.full phone gender company tax zip address'
    }, function (err, results) {
      if (err) return workflow.emit('exception', err)

      for (var key in results) {
        workflow.outcome[key] = results[key]
      }

      return workflow.emit('response')
    })
  })

  return workflow.emit('listUsers')
}
