'use strict'

exports.update = function (req, res, next) {
  var workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.first) {
      workflow.outcome.errfor.first = 'required'
    }

    if (!req.body.last) {
      workflow.outcome.errfor.last = 'required'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('patchAccount')
  })

  workflow.on('patchAccount', function () {
    var fieldsToSet = {
      name: {
        first: req.body.first,
        middle: req.body.middle,
        last: req.body.last,
        full: req.body.first + ' ' + req.body.last
      },
      company: req.body.company,
      phone: req.body.phone,
      zip: req.body.zip,
      search: [
        req.body.first,
        req.body.middle,
        req.body.last,
        req.body.company,
        req.body.phone,
        req.body.zip
      ]
    }
    var options = { new: true }
    req.app.db.models.Account.findByIdAndUpdate(req.params.id, fieldsToSet, options, function (err, account) {
      if (err) {
        return workflow.emit('exception', err)
      }

      workflow.outcome.account = account
      return workflow.emit('response')
    })
  })

  workflow.emit('validate')
}
