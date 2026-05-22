'use strict'
/**
 * CRUD implementation of REST API '/1/post'
 */

/**
 * @openapi
 * /1/post:
 *   get:
 *     tags: [文章]
 *     summary: 取得所有文章
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 999
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           default: -date
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *   post:
 *     tags: [文章]
 *     summary: 新增文章（JSON body）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, content]
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *               preview:
 *                 type: boolean
 *                 default: false
 *                 description: 設為 true 時只回傳預覽，不寫入資料庫
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
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
 * @openapi
 * /1/post/query:
 *   post:
 *     tags: [文章]
 *     summary: 新增文章（Query String）
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: content
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
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

exports.readAll = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  // defaults: no limits
  req.query.limit = req.query.limit ? parseInt(req.query.limit) : 999
  // req.query.page = req.query.page ? parseInt(req.query.page) : 1
  const ALLOWED_POST_SORT = ['date', '-date', 'name', '-name']
  req.query.sort = ALLOWED_POST_SORT.includes(req.query.sort) ? req.query.sort : '-date'

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
 * @openapi
 * /1/post/{name}/publish:
 *   put:
 *     tags: [文章]
 *     summary: 發佈文章（isActive = true）
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: 文章名稱（URL encoded）
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 * /1/post/{name}/unpublish:
 *   put:
 *     tags: [文章]
 *     summary: 取消發佈文章（isActive = false）
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: 文章名稱（URL encoded）
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
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
 * @openapi
 * /1/post/{id}:
 *   delete:
 *     tags: [文章]
 *     summary: 刪除文章
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章 MongoDB ObjectId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
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
