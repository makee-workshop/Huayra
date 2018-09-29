'use strict'

// Post
exports = module.exports = function (app, mongoose) {
  var postSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    content: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    date: { type: Date, default: Date.now }
  })

  postSchema.plugin(require('./plugins/pagedFind'))
  postSchema.set('autoIndex', true)
  app.db.model('Post', postSchema)
}
