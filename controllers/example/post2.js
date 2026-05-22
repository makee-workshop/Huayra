'use strict'

/**
 * @openapi
 * /2/post:
 *   post:
 *     tags: [文章 v2]
 *     summary: 新增文章（ODMService）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功，回傳新建立的 Post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 */
exports.create = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const checkFields = {
    name: 'required',
    content: ''
  }

  try {
    workflow.outcome.data = await req.app.utility.ODMService.create(req, 'Post', checkFields)
  } catch (err) {
    workflow.outcome.errors.push(err.message)
    if (err.errfor) workflow.outcome.errfor = err.errfor
  }

  return workflow.emit('response')
}

/**
 * @openapi
 * /2/post/{id}:
 *   put:
 *     tags: [文章 v2]
 *     summary: 更新文章（ODMService）
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章 MongoDB ObjectId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功，回傳更新後的 Post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 */
exports.update = async function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)
  const checkFields = {
    name: '',
    content: '',
    date: 'date'
  }
  req.body.date = new Date()

  try {
    workflow.outcome.data = await req.app.utility.ODMService.updateById(req, req.params.id, 'Post', checkFields, { new: true })
  } catch (err) {
    workflow.outcome.errors.push(err.message)
    if (err.errfor) workflow.outcome.errfor = err.errfor
  }

  return workflow.emit('response')
}
