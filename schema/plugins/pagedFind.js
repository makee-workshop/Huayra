'use strict'

module.exports = exports = function pagedFindPlugin (schema) {
  schema.statics.pagedFind = async function (options = {}) {
    options.filters = options.filters || {}
    options.keys = options.keys || ''
    options.limit = options.limit || 20
    options.page = options.page || 1
    options.sort = options.sort || {}
    options.populateKey = options.populateKey || ''
    options.populateFor = options.populateFor || ''

    const output = {
      data: null,
      pages: {
        current: options.page,
        prev: 0,
        hasPrev: false,
        next: 0,
        hasNext: false,
        total: 0
      },
      items: {
        begin: ((options.page * options.limit) - options.limit) + 1,
        end: options.page * options.limit,
        total: 0
      }
    }

    const query = this.find(options.filters, options.keys)

    if (options.populateKey !== '' && options.populateFor !== '') {
      query.populate(options.populateKey, options.populateFor)
    }

    const [count, results] = await Promise.all([
      this.countDocuments(options.filters),
      query
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(options.sort)
    ])

    output.items.total = count
    output.data = results
    output.pages.total = Math.ceil(output.items.total / options.limit)
    output.pages.next = ((output.pages.current + 1) > output.pages.total ? 0 : output.pages.current + 1)
    output.pages.hasNext = (output.pages.next !== 0)
    output.pages.prev = output.pages.current - 1
    output.pages.hasPrev = (output.pages.prev !== 0)
    if (output.items.end > output.items.total) {
      output.items.end = output.items.total
    }

    return output
  }
}
