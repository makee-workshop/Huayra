# Huayra

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/makee-workshop/Huayra/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/makee-workshop/Huayra/blob/master/CONTRIBUTING.md)

Built heavily based on [Aqua](https://github.com/jedireza/aqua) and [Drywall](https://github.com/jedireza/drywall), a website and user system starter base on Node.JS v18.17.0. Implemented with Express and React.

| On The Server | On The Client  | Development  |
| ------------- | -------------- | ------------ |
| Express       | Bootstrap      | react-scripts|
| Mongoose      | React          | Nodemon      |
| Passport      | Redux          | concurrently |
| Async         | Linearicons    |              |
| EmailJS       |                |              |

![Imgur](https://i.imgur.com/LrvL3IF.png)

## Features

 - Universal front-end website
   - Basic web pages ready to customize
   - Contact page with form to email
   - Account sign-up page
   - Login pages including forgot and reset password
 - My account area
   - Stub dashboard ready to customize
   - Settings screen to update contact info and login credentials
 - Admin back office
   - Stub dashboard ready to customize
   - Manage users

## Technology

Server side, Huayra is built with the [Express](http://expressjs.com/) framework.
We're using [MongoDB](http://www.mongodb.org/) as a data store.

The front-end is built with [React](https://github.com/facebook/react). We use
[Redux](https://github.com/reactjs/redux) as our state container. Client side
routing is done with [React Router](https://github.com/reactjs/react-router).
We're using [create-react-app](https://github.com/facebook/create-react-app) for the build system.

We use [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) for hashing
secrets. If you have issues during installation related to `bcrypt` then [refer
to this
page](https://oranwind.org/node-js-bcrypt/).

## Installation

```bash
$ npm install
```

## Setup

First you need to setup your config file.

```bash
$ mv ./config.example.js ./config.js #set mongodb and email credentials
```

## Set Admin

Register the `root` account and run command.

```bash
$ cd db-scripts
$ mongo S001-init-admin-database.js
```

## Running the app

```bash
$ npm start
# [0]
# [0] > huayra@0.18.1 server C:\git\huayra
# [0] > nodemon app.js
# [0]
# [1]
# [1] > huayra@0.18.1 client C:\git\huayra
# [1] > react-scripts start
# [1]
# [0] [nodemon] 1.14.9
# [0] [nodemon] to restart at any time, enter `rs`
# [0] [nodemon] watching: *.*
# [0] [nodemon] starting `node app.js`
# [0] Server is running on port 3001
```

## Build Front-End For Deployment

```bash
$ npm run build
```

## Test

```
$ npm test
```