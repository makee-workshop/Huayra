'use strict'

const assertRequired = function (value, message) {
  if (!value) {
    throw new Error(message)
  }
}

const getFieldsToSet = function (req, checkFields) {
  const fieldsToSet = {}
  const remainingFields = Object.assign({}, checkFields)

  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(remainingFields, key)) {
      if (remainingFields[key].includes('array')) {
        fieldsToSet[key] = req.body[key].split(',')
      } else if (remainingFields[key].includes('object')) {
        fieldsToSet[key] = JSON.parse(req.body[key])
      } else if (remainingFields[key].includes('date')) {
        fieldsToSet[key] = new Date(req.body[key])
      } else {
        fieldsToSet[key] = req.body[key]
      }

      delete remainingFields[key]
    }
  }

  const errfor = {}
  for (const key in remainingFields) {
    if (remainingFields[key].includes('required')) {
      errfor[key] = '必填欄位'
    }
  }

  if (Object.keys(errfor).length !== 0) {
    const err = new Error('有欄位尚未填寫')
    err.errfor = errfor
    throw err
  }

  return fieldsToSet
}

const getChangedFields = function (originData, fieldsToSet) {
  const update = { $set: {} }

  for (const key in fieldsToSet) {
    if (originData[key] !== fieldsToSet[key]) {
      update.$set[key] = fieldsToSet[key]
    }
  }

  return update
}

exports.create = async function (req = null, schema = null, checkFields = null) {
  assertRequired(req, 'req parameter is required.')
  assertRequired(schema, 'schema parameter is required.')
  assertRequired(checkFields, 'checkFields parameter is required.')

  const fieldsToSet = getFieldsToSet(req, checkFields)
  return req.app.db.models[schema].create(fieldsToSet)
}

exports.updateById = async function (req = null, _id = null, schema = null, checkFields = null, option = null) {
  assertRequired(req, 'req parameter is required.')
  assertRequired(_id, '_id parameter is required.')
  assertRequired(schema, 'schema parameter is required.')
  assertRequired(option, 'option parameter is required.')
  assertRequired(checkFields, 'checkFields parameter is required.')

  const fieldsToSet = getFieldsToSet(req, checkFields)
  const originData = await req.app.db.models[schema].findById(_id)

  if (!originData) {
    throw new Error('data not found.')
  }

  return req.app.db.models[schema].findByIdAndUpdate(
    _id,
    getChangedFields(originData, fieldsToSet),
    option
  )
}

exports.updateByQuery = async function (req = null, query = null, schema = null, checkFields = null, option = null) {
  assertRequired(req, 'req parameter is required.')
  assertRequired(query, 'query parameter is required.')
  assertRequired(schema, 'schema parameter is required.')
  assertRequired(option, 'option parameter is required.')
  assertRequired(checkFields, 'checkFields parameter is required.')

  const fieldsToSet = getFieldsToSet(req, checkFields)
  const originData = await req.app.db.models[schema].findOne(query)

  if (!originData) {
    throw new Error('data not found.')
  }

  const updateOptions = Object.assign({}, option)
  delete updateOptions.multi

  if (option.multi) {
    return req.app.db.models[schema].updateMany(query, getChangedFields(originData, fieldsToSet), updateOptions)
  }

  return req.app.db.models[schema].updateOne(query, getChangedFields(originData, fieldsToSet), updateOptions)
}
