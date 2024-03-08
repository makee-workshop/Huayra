'use strict'

// Post
exports = module.exports = function (app, mongoose) {
  var schema = new mongoose.Schema({
    name: { type: String, default: '' },
    content: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    date: { type: Date, default: Date.now }
  })

  schema.plugin(require('./plugins/pagedFind'))
  schema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('Post', schema)
}
