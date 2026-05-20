'use strict'

exports.getAccountInfo = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  workflow.outcome.data = {}

  try {
    const account = await req.app.db.models.Account.findById(req.user.roles.account.id, 'name company phone zip')
    workflow.outcome.data = account
    return workflow.emit('response')
  } catch (err) {
    return workflow.emit('exception', err)
  }
}

exports.adminGetAccountInfo = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const aid = req.params.id
  workflow.outcome.data = {}

  try {
    const account = await req.app.db.models.Account.findById(aid)
    workflow.outcome.data = account
    return workflow.emit('response')
  } catch (err) {
    return workflow.emit('exception', err)
  }
}

exports.getUserInfo = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  workflow.outcome.data = {}

  try {
    const user = await req.app.db.models.User.findById(req.user.id, 'username email')
    workflow.outcome.data = user
    return workflow.emit('response')
  } catch (err) {
    return workflow.emit('exception', err)
  }
}

exports.admingetUserInfo = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const uid = req.params.id
  workflow.outcome.data = {}

  try {
    const user = await req.app.db.models.User.findById(uid, 'username email isActive roles')
    workflow.outcome.data = user
    return workflow.emit('response')
  } catch (err) {
    return workflow.emit('exception', err)
  }
}

exports.adminGetUsers = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  req.query.limit = req.query.limit ? parseInt(req.query.limit) : 10
  req.query.page = req.query.page ? parseInt(req.query.page) : 1
  req.query.sort = req.query.sort ? req.query.sort : '-timeCreated'
  req.query.search = req.query.search || ''

  workflow.on('listUsers', async function () {
    const filters = {}
    if (req.query.search) {
      const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const search = new RegExp(escaped, 'i')
      filters.$or = [{ username: search }, { email: search }]
    }

    try {
      const results = await req.app.db.models.User.pagedFind({
        filters,
        limit: req.query.limit,
        page: req.query.page,
        sort: req.query.sort,
        populateKey: 'roles.account',
        populateFor: 'name.full phone gender company tax zip address'
      })
      for (const key in results) {
        workflow.outcome[key] = results[key]
      }

      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  return workflow.emit('listUsers')
}
