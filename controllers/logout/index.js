'use strict'

/**
 * @openapi
 * /1/account/logout/:
 *   get:
 *     tags: [帳號]
 *     summary: 登出
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
exports.logout = async function (req, res) {
  const workflow = req.app.utility.workflow(req, res)
  const token = req.headers.authorization.replace(/^Bearer\s+/i, '')
  try {
    await req.app.db.models.UserToken.deleteOne({
      user: req.user._id,
      tokenHash: req.app.db.models.UserToken.hashToken(token)
    })
    return workflow.emit('response')
  } catch (err) {
    return workflow.emit('exception', err)
  }
}
