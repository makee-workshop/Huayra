'use strict'

exports.init = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const collections = ['User', 'Admin']

  try {
    const counts = await Promise.all(collections.map(function (el) {
      return req.app.db.models[el].countDocuments({})
    }))
    const sigma = collections.reduce(function (memo, el, index) {
      memo[el] = counts[index]
      return memo
    }, {})
    workflow.outcome.data = sigma
    return workflow.emit('response')
  } catch (err) {
    return next(err)
  }
}
