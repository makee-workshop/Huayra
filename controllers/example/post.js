'use strict'
/**
 * CRUD implementation of REST API '/1/post'
 */

/**
   * POST /1/post
   *
   * @method create
   * @summary 新增一筆資料至 mongodb
   * @param {String} name. 名稱.
   * @param {String} content. 內容.
   */
exports.create = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    // Backbone way use req.body, not req.query
    if (!req.body.name) workflow.outcome.errfor.name = '請填寫名稱'
    if (!req.body.content) workflow.outcome.errfor.content = '請填寫內容'

    // return if we have errors already
    if (workflow.hasErrors()) {
      workflow.outcome.errors.push('有欄位尚未填寫')
      return workflow.emit('response')
    }

    if (req.body.preview === true) {
      workflow.outcome.status = 'preview'
      return workflow.emit('response')
    }

    return workflow.emit('saveNewPost')
  })

  workflow.on('saveNewPost', async function () {
    const fieldsToSet = {
      name: req.body.name.trim(),
      content: req.body.content.trim()
    }

    try {
      await req.app.db.models.Post.create(fieldsToSet)
      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  return workflow.emit('validate')
}

/**
   * POST /1/post/query
   *
   * @method createByQuery
   * @summary Create a document by Query String (REST Console, jQuery AJAX etc)
   * @param {String} name. 名稱.
   * @param {String} content. 內容.
   */
exports.createByQuery = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    // use req.query
    if (!req.query.name) workflow.outcome.errfor.name = '請填寫名稱'
    if (!req.query.content) workflow.outcome.errfor.content = '請填寫內容'

    // return if we have errors already
    if (workflow.hasErrors()) {
      workflow.outcome.errors.push('有欄位尚未填寫')
      return workflow.emit('response')
    }

    return workflow.emit('saveNewPost')
  })

  workflow.on('saveNewPost', async function () {
    const fieldsToSet = {
      name: req.query.name.trim(),
      content: req.query.content.trim()
    }

    try {
      await req.app.db.models.Post.create(fieldsToSet)
      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  return workflow.emit('validate')
}

/**
   * GET /1/post
   *
   * @method readAll
   * @summary read all posts
   */
exports.readAll = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  // defaults: no limits
  req.query.limit = req.query.limit ? parseInt(req.query.limit) : 999
  // req.query.page = req.query.page ? parseInt(req.query.page) : 1
  req.query.sort = req.query.sort ? req.query.sort : '-date'

  workflow.on('listPost', async function () {
    try {
      const posts = await req.app.db.models.Post.pagedFind({
        keys: 'name content date',
        limit: req.query.limit,
        // page: req.query.page,
        sort: req.query.sort
      })

      for (const key in posts) {
        workflow.outcome[key] = posts[key]
      }

      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  return workflow.emit('listPost')
}

/**
   * PUT /1/post/:name/publish
   *
   * @method activate
   * @summary 修改某人的發佈狀態為 true
   * @param {String} name. 名稱.
   */
exports.activate = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const name = req.params.name.trim()
  const decode = decodeURIComponent(name)

  workflow.on('updatePost', async function () {
    const fieldsToSet = {
      isActive: true
    }

    try {
      const numAffected = await req.app.db.models.Post.updateMany({ name: decode }, fieldsToSet)
      workflow.outcome.numAffected = numAffected

      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('updatePost')
}

/**
   * PUT /1/post/:name/unpublish
   *
   * @method inactivate
   * @summary 修改某人的發佈狀態為 false
   * @param {String} name. 名稱.
   */
exports.inactivate = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const name = req.params.name.trim()
  const decode = decodeURIComponent(name)

  workflow.on('updatePost', async function () {
    const fieldsToSet = {
      isActive: false
    }

    try {
      const numAffected = await req.app.db.models.Post.updateMany({ name: decode }, fieldsToSet)
      workflow.outcome.numAffected = numAffected

      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('updatePost')
}

/**
   * DELETE /1/post/:id
   *
   * @method delete
   * @summary 刪除指定 id 的 document
   * @param {String} id.
   */
exports.delete = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const _id = req.params.id

  workflow.on('deletePost', async function () {
    try {
      const post = await req.app.db.models.Post.findByIdAndDelete(_id)
      workflow.outcome.post = post

      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('deletePost')
}
