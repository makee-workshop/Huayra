'use strict'

exports = module.exports = function (app, mongoose) {
  var schema = new mongoose.Schema({
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' }
    },
    name: {
      full: { type: String, default: '' },
      first: { type: String, default: '' },
      middle: { type: String, default: '' },
      last: { type: String, default: '' }
    },
    groups: [{ type: String, ref: 'AdminGroup' }],
    permissions: [{
      name: String,
      permit: Boolean
    }],
    timeCreated: { type: Date, default: Date.now },
    search: [String]
  })
  schema.methods.hasPermissionTo = function (something) {
    // check group permissions
    var groupHasPermission = false
    for (var i = 0; i < this.groups.length; i++) {
      for (var j = 0; j < this.groups[i].permissions.length; j++) {
        if (this.groups[i].permissions[j].name === something) {
          if (this.groups[i].permissions[j].permit) {
            groupHasPermission = true
          }
        }
      }
    }

    // check admin permissions
    for (var k = 0; k < this.permissions.length; k++) {
      if (this.permissions[k].name === something) {
        if (this.permissions[k].permit) {
          return true
        }

        return false
      }
    }

    return groupHasPermission
  }
  schema.methods.isMemberOf = function (group) {
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i]._id === group) {
        return true
      }
    }

    return false
  }
  schema.plugin(require('./plugins/pagedFind'))
  schema.index({ 'user.id': 1 })
  schema.index({ search: 1 })
  schema.set('autoIndex', (app.get('env') === 'development'))
  app.db.model('Admin', schema)
}
