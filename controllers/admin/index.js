'use strict'

exports.init = function (req, res, next) {
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  var sigma = {}
  var collections = ['User', 'Admin']
  var queries = []

  collections.forEach(function (el, i, arr) {
    queries.push(function (done) {
      req.app.db.models[el].count({}, function (err, count) {
        if (err) {
          return done(err, null)
        }

        sigma[el] = count
        done(null, el)
      })
    })
  })

  var asyncFinally = function (err, results) {
    if (err) {
      return next(err)
    }

    workflow.outcome.data = sigma
    return workflow.emit('response')
  }

  require('async').parallel(queries, asyncFinally)
}
