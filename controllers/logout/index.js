'use strict'

exports.logout = function (req, res) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  req.logout()
  return workflow.emit('response')
}
