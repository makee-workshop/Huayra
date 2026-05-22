'use strict'

/**
 * @openapi
 * /1/admin/count:
 *   get:
 *     tags: [管理員]
 *     summary: 取得使用者與管理員總數
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
 *                     User:
 *                       type: integer
 *                     Admin:
 *                       type: integer
 */
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
