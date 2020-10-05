'use strict'

exports.logout = function (req, res) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  var token = req.headers.authorization.replace('Bearer ', '')
  req.user.jwt = req.user.jwt.filter(j => j.token !== token)
  req.user.save()
  return workflow.emit('response')
}
