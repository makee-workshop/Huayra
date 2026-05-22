'use strict'

/**
 * @openapi
 * /1/admin/account/{id}:
 *   put:
 *     tags: [管理員]
 *     summary: 更新指定帳號資料（姓名、公司、電話）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first, last]
 *             properties:
 *               first:
 *                 type: string
 *               middle:
 *                 type: string
 *               last:
 *                 type: string
 *               company:
 *                 type: string
 *               phone:
 *                 type: string
 *               zip:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 */
exports.update = function (req, res, next) {
  const workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', function () {
    if (!req.body.first) {
      workflow.outcome.errfor.first = 'required'
    }

    if (!req.body.last) {
      workflow.outcome.errfor.last = 'required'
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response')
    }

    workflow.emit('patchAccount')
  })

  workflow.on('patchAccount', async function () {
    const reg = /^[\u4E00-\u9FA5]+$/
    let fullName = ''
    if (reg.test(req.body.first + req.body.last)) {
      fullName = req.body.last + req.body.first
    } else {
      fullName = req.body.first + ' ' + req.body.last
    }

    const fieldsToSet = {
      name: {
        first: req.body.first,
        middle: req.body.middle,
        last: req.body.last,
        full: fullName
      },
      company: req.body.company,
      phone: req.body.phone,
      zip: req.body.zip,
      search: [
        req.body.first,
        req.body.middle,
        req.body.last,
        req.body.company,
        req.body.phone,
        req.body.zip
      ]
    }
    const options = { new: true }
    try {
      const account = await req.app.db.models.Account.findByIdAndUpdate(req.params.id, fieldsToSet, options)
      workflow.outcome.account = account
      return workflow.emit('response')
    } catch (err) {
      return workflow.emit('exception', err)
    }
  })

  workflow.emit('validate')
}
