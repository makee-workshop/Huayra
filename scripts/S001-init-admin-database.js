{
  var db = connect('localhost/makeeweb');

  // 1. check admingroups - if exists will be ignored.
  db.admingroups.save({ _id: 'root', name: 'Root' });

  // 2. check account & admin
  var usersToInit = [{
    username: 'root',
    email: 'root@email.addy',
    first: '',
    last: '',
    full: 'root'
  }, {
    username: '<yourname>',
    email: '<email>',
    first: '<first name>',
    last: '<last name>',
    full: '<full name>'
  }];

  for (i in usersToInit) {
    var newUser = usersToInit[i];

    var newAdmin = {
      name: {
        first: newUser.first,
        last: newUser.last,
        full: newUser.full
      }, groups: ['root']
    };

    var rootAdmin = db.admins.findAndModify({
      query: newAdmin,
      update: newAdmin,
      upsert: true,
      new: true
    });

    user = db.users.findOne({ username: newUser.username });
    if (user) {
      if (!user.roles.admin) {
        user.roles.admin = rootAdmin._id;
        db.users.save(user);

        print('username "' + user.username + '" is exists, setting admin role.');
      }
    } else {
      print('username "' + newUser.username + '" is not exists, create new user with admin role.');
      db.users.save({
        username: newUser.username,
        email: newUser.email,
        isActive: true,
        // use default password: 123456
        password: "ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413",
        roles: { admin: rootAdmin._id }
      });
      user = db.users.findOne({ username: newUser.username });
    }

    // link user back to admin
    rootAdmin.user = {
      id: user._id,
      name: user.username
    };
    db.admins.save(rootAdmin);

    var newAccount = {
      search: [
        user.username
      ],
      userCreated: {
        name: ""
      },
      notes: [],
      statusLog: [],
      status: {
        userCreated: {
          name: ""
        },
        name: ""
      },
      zip: "",
      phone: "",
      company: "",
      name: {
        full: rootAdmin.name.full,
        last: "",
        middle: "",
        first: ""
      },
      user: {
        id: user._id,
        name: user.username
      }
    };

    var rootAccount = db.accounts.findAndModify({
      query: newAccount,
      update: newAccount,
      upsert: true,
      new: true
    });

    if (!user.roles.account) {
      user.roles.account = rootAccount._id;
      db.users.save(user);
      print('username "' + user.username + '" is exists, setting account role.');
    } else {
      print('username "' + user.username + '" is exists with admin and account role.');
    }

  }
  print("Info: Init admin db finished.");
}