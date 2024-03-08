'use strict'

exports = module.exports = function (app, mongoose) {
  var schema = new mongoose.Schema({
    _id: { type: String },
    name: { type: String, default: '' },
    permissions: [{ name: String, permit: Boolean }]
  })
  schema.plugin(require('./plugins/pagedFind'))
  schema.index({ name: 1 }, { unique: true })
  schema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('AdminGroup', schema)
}
