'use strict'

/**
 * @openapi
 * /1/account:
 *   get:
 *     tags: [帳號]
 *     summary: 取得帳號資料（姓名、公司、電話）
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: object
 *                       properties:
 *                         first:
 *                           type: string
 *                         last:
 *                           type: string
 *                         full:
 *                           type: string
 *                     company:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     zip:
 *                       type: string
 */
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

/**
 * @openapi
 * /1/admin/account/{id}:
 *   get:
 *     tags: [管理員]
 *     summary: 取得指定帳號資料
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
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

/**
 * @openapi
 * /1/account/user:
 *   get:
 *     tags: [帳號]
 *     summary: 取得登入使用者的帳號名稱與 email
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 */
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

/**
 * @openapi
 * /1/admin/user/{id}:
 *   get:
 *     tags: [管理員]
 *     summary: 取得指定使用者資料
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     isActive:
 *                       type: boolean
 *                     roles:
 *                       type: object
 */
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

/**
 * @openapi
 * /1/admin/users:
 *   get:
 *     tags: [管理員]
 *     summary: 取得使用者列表（分頁 + 搜尋）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           default: -timeCreated
 *       - name: search
 *         in: query
 *         description: 搜尋 username 或 email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
exports.adminGetUsers = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  req.query.limit = req.query.limit ? parseInt(req.query.limit) : 10
  req.query.page = req.query.page ? parseInt(req.query.page) : 1
  const ALLOWED_USER_SORT = ['timeCreated', '-timeCreated', 'username', '-username', 'email', '-email']
  req.query.sort = ALLOWED_USER_SORT.includes(req.query.sort) ? req.query.sort : '-timeCreated'
  req.query.search = typeof req.query.search === 'string' ? req.query.search : ''

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
