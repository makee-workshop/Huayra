'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../config')

async function main () {
  mongoose.connect(config.mongodb.uri)
  const db = mongoose.connection
  await new Promise((resolve, reject) => {
    db.once('open', resolve)
    db.once('error', reject)
  })
  console.log('Connected to MongoDB:', config.mongodb.uri)

  const app = {
    db,
    config,
    get: (key) => key === 'env' ? 'development' : undefined
  }
  require('../models')(app, mongoose)

  const AdminGroup = mongoose.model('AdminGroup')
  const Admin = mongoose.model('Admin')
  const User = mongoose.model('User')
  const Account = mongoose.model('Account')

  // 1. AdminGroup
  await AdminGroup.findByIdAndUpdate(
    'root',
    { _id: 'root', name: 'Root' },
    { upsert: true, new: true }
  )
  console.log('AdminGroup "root" ensured')

  // 2. Admin
  let admin = await Admin.findOne({ 'name.full': 'root', groups: 'root' })
  if (!admin) {
    admin = await Admin.create({ name: { first: '', last: '', full: 'root' }, groups: ['root'] })
    console.log('Admin created:', admin._id)
  } else {
    console.log('Admin already exists:', admin._id)
  }

  // 3. User (default password: 123456)
  let user = await User.findOne({ username: 'root' })
  if (!user) {
    const hash = await bcrypt.hash('123456', 10)
    user = await User.create({
      username: 'root',
      email: 'root@email.addy',
      isActive: true,
      password: hash,
      roles: { admin: admin._id }
    })
    console.log('User created:', user.username)
  } else {
    console.log('User already exists:', user.username)
    if (!user.roles.admin) {
      user.roles.admin = admin._id
      await user.save()
      console.log('User admin role updated')
    }
  }

  // Link user back to admin
  if (!admin.user || String(admin.user.id) !== String(user._id)) {
    admin.user = { id: user._id, name: user.username }
    await admin.save()
    console.log('Admin linked to user')
  }

  // 4. Account
  let account = await Account.findOne({ 'user.id': user._id })
  if (!account) {
    account = await Account.create({
      user: { id: user._id, name: user.username },
      name: { full: 'root', first: '', middle: '', last: '' },
      search: [user.username]
    })
    console.log('Account created:', account._id)
  } else {
    console.log('Account already exists:', account._id)
  }

  if (!user.roles.account) {
    user.roles.account = account._id
    await user.save()
    console.log('User account role updated')
  }

  console.log('Init finished.')
  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
