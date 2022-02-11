'use strict'

exports.create = function (req = null, schema = null, checkFields = null, next = null) {
  if (!req) {
    next('req parameter is required.')
  } else if (!schema) {
    next('schema parameter is required.')
  } else if (!checkFields) {
    next('checkFields parameter is required.')
  }

  var workflow = new req.app.utility.workflow(req, null) // eslint-disable-line

  workflow.on('validateFields', function () {
    var fieldsToSet = {}
    for (var key in req.body) {
      if (Object.prototype.hasOwnProperty.call(checkFields, key)) {
        if (checkFields[key].includes('array')) {
          fieldsToSet[key] = req.body[key].split(',')
        } else if (checkFields[key].includes('object')) {
          fieldsToSet[key] = JSON.parse(req.body[key])
        } else if (checkFields[key].includes('date')) {
          fieldsToSet[key] = new Date(req.body[key])
        } else {
          fieldsToSet[key] = req.body[key]
        }

        delete checkFields[key]
      }
    }

    var errfor = {}
    var hasErrors = false
    for (key in checkFields) {
      if (checkFields[key].includes('required')) {
        errfor[key] = '必填欄位'
        hasErrors = true
      }
    }
    if (hasErrors) {
      next('有欄位尚未填寫', errfor)
    } else {
      return workflow.emit('saveData', fieldsToSet)
    }
  })

  workflow.on('saveData', function (fieldsToSet) {
    new req.app.db.models[schema](fieldsToSet).save(function (err, data) {
      if (err) next(err, null)
      else next(null, data)
    })
  })

  return workflow.emit('validateFields')
}

exports.updateById = function (req = null, _id = null, schema = null, checkFields = null, option = null, next = null) {
  if (!req) {
    next('req parameter is required.')
  } else if (!_id) {
    next('_id parameter is required.')
  } else if (!schema) {
    next('schema parameter is required.')
  } else if (!option) {
    next('option parameter is required.')
  } else if (!checkFields) {
    next('checkFields parameter is required.')
  }

  var workflow = new req.app.utility.workflow(req, null) // eslint-disable-line

  workflow.on('validateFields', function () {
    workflow.fieldsToSet = {}

    for (var key in req.body) {
      if (Object.prototype.hasOwnProperty.call(checkFields, key)) {
        if (checkFields[key].includes('array')) {
          workflow.fieldsToSet[key] = req.body[key].split(',')
        } else if (checkFields[key].includes('object')) {
          workflow.fieldsToSet[key] = JSON.parse(req.body[key])
        } else if (checkFields[key].includes('date')) {
          workflow.fieldsToSet[key] = new Date(req.body[key])
        } else {
          workflow.fieldsToSet[key] = req.body[key]
        }

        delete checkFields[key]
      }
    }

    var errfor = {}
    var hasErrors = false
    for (key in checkFields) {
      if (checkFields[key].includes('required')) {
        errfor[key] = '必填欄位'
        hasErrors = true
      }
    }
    if (hasErrors) {
      next('有欄位尚未填寫', errfor)
    } else {
      return workflow.emit('getData')
    }
  })

  workflow.on('getData', function () {
    req.app.db.models[schema].findById(_id)
      .exec(function (err, data) {
        if (err) next(err, null)

        if (!data) {
          next('data not found.', null)
        }

        return workflow.emit('updateData', data)
      })
  })

  workflow.on('updateData', function (originData) {
    const fieldsToSet = { $set: {} }
    for (const key in workflow.fieldsToSet) {
      if (originData[key] !== workflow.fieldsToSet[key]) { // if the field we have in req.body exists, we're gonna update it
        fieldsToSet.$set[key] = workflow.fieldsToSet[key]
      }
    }

    req.app.db.models[schema].findByIdAndUpdate(
      _id,
      fieldsToSet,
      option,
      function (err, data) {
        if (err) next(err, null)
        else next(null, data)
      })
  })

  return workflow.emit('validateFields')
}

exports.updateByQuery = function (req = null, query = null, schema = null, checkFields = null, option = null, next = null) {
  if (!req) {
    next('req parameter is required.')
  } else if (!query) {
    next('query parameter is required.')
  } else if (!schema) {
    next('schema parameter is required.')
  } else if (!option) {
    next('option parameter is required.')
  } else if (!checkFields) {
    next('checkFields parameter is required.')
  }

  var workflow = new req.app.utility.workflow(req, null) // eslint-disable-line

  workflow.on('validateFields', function () {
    workflow.fieldsToSet = {}

    for (var key in req.body) {
      if (Object.prototype.hasOwnProperty.call(checkFields, key)) {
        if (checkFields[key].includes('array')) {
          workflow.fieldsToSet[key] = req.body[key].split(',')
        } else if (checkFields[key].includes('object')) {
          workflow.fieldsToSet[key] = JSON.parse(req.body[key])
        } else if (checkFields[key].includes('date')) {
          workflow.fieldsToSet[key] = new Date(req.body[key])
        } else {
          workflow.fieldsToSet[key] = req.body[key]
        }

        delete checkFields[key]
      }
    }

    var errfor = {}
    var hasErrors = false
    for (key in checkFields) {
      if (checkFields[key].includes('required')) {
        errfor[key] = '必填欄位'
        hasErrors = true
      }
    }
    if (hasErrors) {
      next('有欄位尚未填寫', errfor)
    } else {
      return workflow.emit('getData')
    }
  })

  workflow.on('getData', function () {
    req.app.db.models[schema].findById(query)
      .exec(function (err, data) {
        if (err) next(err, null)

        if (!data) {
          next('data not found.', null)
        }

        return workflow.emit('updateData', data)
      })
  })

  workflow.on('updateData', function (originData) {
    const fieldsToSet = { $set: {} }
    for (const key in workflow.fieldsToSet) {
      if (originData[key] !== workflow.fieldsToSet[key]) { // if the field we have in req.body exists, we're gonna update it
        fieldsToSet.$set[key] = workflow.fieldsToSet[key]
      }
    }

    req.app.db.models[schema].update(
      query,
      fieldsToSet,
      option,
      function (err, numAffected) {
        if (err) next(err, null)
        else next(null, numAffected)
      })
  })

  return workflow.emit('validateFields')
}
