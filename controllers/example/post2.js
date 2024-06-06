'use strict'

exports.create = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  const checkFields = {
    name: 'required',
    content: ''
  }

  req.app.utility.ODMService.create(req, 'Post', checkFields,
    function (err, data) {
      if (err) {
        workflow.outcome.errors.push(err)
        if (data) workflow.outcome.errfor = data
      } else {
        workflow.outcome.data = data
      }

      return workflow.emit('response')
    })
}

exports.update = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  const checkFields = {
    name: '',
    content: '',
    date: 'date'
  }
  req.body.date = new Date()

  req.app.utility.ODMService.updateById(req, req.params.id, 'Post', checkFields, { new: true },
    function (err, data) {
      if (err) {
        workflow.outcome.errors.push(err)
        if (data) workflow.outcome.errfor = data
      } else {
        workflow.outcome.data = data
      }

      return workflow.emit('response')
    })
}
