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
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line

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

  workflow.on('saveNewPost', function () {
    var fieldsToSet = {
      name: req.body.name.trim(),
      content: req.body.content.trim()
    }

    new req.app.db.models.Post(fieldsToSet).save(function (err) {
      if (err) return workflow.emit('exception', err)
      return workflow.emit('response')
    })
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
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line

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

  workflow.on('saveNewPost', function () {
    var fieldsToSet = {
      name: req.query.name.trim(),
      content: req.query.content.trim()
    }

    new req.app.db.models.Post(fieldsToSet).save(function (err) {
      if (err) return workflow.emit('exception', err)
      return workflow.emit('response')
    })
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
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line

  // defaults: no limits
  req.query.limit = req.query.limit ? parseInt(req.query.limit) : 999
  // req.query.page = req.query.page ? parseInt(req.query.page) : 1
  req.query.sort = req.query.sort ? req.query.sort : '-date'

  workflow.on('listPost', function () {
    req.app.db.models.Post.pagedFind({
      keys: 'name content date',
      limit: req.query.limit,
      // page: req.query.page,
      sort: req.query.sort
    }, function (err, posts) {
      if (err) return workflow.emit('exception', err)

      for (var key in posts) {
        workflow.outcome[key] = posts[key]
      }

      return workflow.emit('response')
    })
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
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  var name = req.params.name.trim()
  var decode = decodeURIComponent(name)

  workflow.on('updatePost', function () {
    var fieldsToSet = {
      isActive: true
    }

    req.app.db.models.Post.update({ name: decode }, fieldsToSet, { multi: true }, function (err, numAffected) {
      if (err) return workflow.emit('exception', err)

      workflow.outcome.numAffected = numAffected

      return workflow.emit('response')
    })
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
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  var name = req.params.name.trim()
  var decode = decodeURIComponent(name)

  workflow.on('updatePost', function () {
    var fieldsToSet = {
      isActive: false
    }

    req.app.db.models.Post.update({ name: decode }, fieldsToSet, { multi: true }, function (err, numAffected) {
      if (err) return workflow.emit('exception', err)

      workflow.outcome.numAffected = numAffected

      return workflow.emit('response')
    })
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
  var workflow = new req.app.utility.workflow(req, res) // eslint-disable-line
  var _id = req.params.id

  workflow.on('deletePost', function () {
    req.app.db.models.Post.findByIdAndRemove(_id, function (err, post) {
      if (err) return workflow.emit('exception', err)

      workflow.outcome.post = post

      return workflow.emit('response')
    })
  })

  workflow.emit('deletePost')
}
