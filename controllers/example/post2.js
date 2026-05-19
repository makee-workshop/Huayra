'use strict'

exports.create = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const checkFields = {
    name: 'required',
    content: ''
  }

  try {
    workflow.outcome.data = await req.app.utility.ODMService.create(req, 'Post', checkFields)
  } catch (err) {
    workflow.outcome.errors.push(err.message)
    if (err.errfor) workflow.outcome.errfor = err.errfor
  }

  return workflow.emit('response')
}

exports.update = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const checkFields = {
    name: '',
    content: '',
    date: 'date'
  }
  req.body.date = new Date()

  try {
    workflow.outcome.data = await req.app.utility.ODMService.updateById(req, req.params.id, 'Post', checkFields, { new: true })
  } catch (err) {
    workflow.outcome.errors.push(err.message)
    if (err.errfor) workflow.outcome.errfor = err.errfor
  }

  return workflow.emit('response')
}
