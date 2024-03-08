'use strict'

exports = module.exports = function (app, mongoose) {
  var schema = new mongoose.Schema({
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' }
    },
    isVerified: { type: String, default: '' },
    verificationToken: { type: String, default: '' },
    name: {
      first: { type: String, default: '' },
      middle: { type: String, default: '' },
      last: { type: String, default: '' },
      full: { type: String, default: '' }
    },
    company: { type: String, default: '' },
    phone: { type: String, default: '' },
    zip: { type: String, default: '' },
    search: [String]
  })
  schema.plugin(require('./plugins/pagedFind'))
  schema.index({ user: 1 })
  schema.index({ search: 1 })
  schema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('Account', schema)
}
