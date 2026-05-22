# Huayra

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Huayra is a full-stack website and user-management starter built with Express,
MongoDB, Passport, React, Redux, React Router, Bootstrap, and Vite. It provides
public pages, authentication, account settings, admin user management, contact
email handling, and example post APIs.

This project was originally based on [Aqua](https://github.com/jedireza/aqua)
and [Drywall](https://github.com/jedireza/drywall), and has since been updated
to a modern Vite + React 18 frontend with an Express 5 backend.

## Current Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js 22+ |
| Server | Express 5, Passport, JWT, Mongoose, Pug email templates |
| Database | MongoDB |
| Client | React 18, React Router 6, Redux Toolkit, React Redux |
| UI | Bootstrap 5, Reactstrap, styled-components, react-data-table-component |
| Tooling | Vite 6, Nodemon, Concurrently, StandardJS |

## Features

- Public website pages for home, about, contact, signup, login, forgot password,
  password reset, and fallback 404 handling.
- Contact form endpoint with email templates.
- JWT-based authentication through Passport.
- Account area with account profile, identity, and password settings.
- Optional account verification workflow.
- Admin area with dashboard, user list, user creation, user editing, password
  management, activation state, role display, search, pagination, and deletion.
- Example post endpoints for API development reference.
- Database initialization script for creating the root admin account.

## Requirements

- Node.js `>=22.0.0`
- npm
- MongoDB running locally or a MongoDB connection URI
- SMTP credentials if contact, signup, forgot password, or verification emails
  should be delivered

## Installation

```bash
npm install
```

## Configuration

Create the local configuration file:

```bash
cp config.example.js config.js
```

Then update `config.js` for your environment. The most important settings are:

- `port`: backend server port, default `3001`
- `mongodb.uri`: MongoDB connection string, default
  `mongodb://localhost:27017/huayra`
- `cryptoKey`: cookie signing key
- `secretkey`: JWT signing key
- `expiresIn`: JWT expiration, default `15 days`
- `requireAccountVerification`: enable or disable account email verification
- `smtp`: outbound email settings

Environment variables supported by `config.example.js` include:

- `PORT`
- `MONGOLAB_URI`
- `MONGOHQ_URL`
- `SMTP_FROM_NAME`
- `SMTP_FROM_ADDRESS`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_HOST`

## Database Initialization

After configuring MongoDB, initialize the default admin data:

```bash
npm run db:init
```

The initializer ensures:

- admin group: `root`
- admin user: `root`
- default password: `123456`
- default email: `root@email.addy`
- matching account record linked to the user

Change the default password after the first login.

## Development

Run the backend and frontend together:

```bash
npm start
```

This starts:

- Express API server: `http://localhost:3001`
- Vite dev server: `http://localhost:3000`

The Vite dev server proxies `/1/*` API requests to the Express server.

You can also run each side separately:

```bash
npm run server
npm run client
```

## Useful Routes

Frontend routes:

- `/`
- `/about`
- `/contact`
- `/signup`
- `/login`
- `/login/forgot`
- `/login/reset/:email/:key`
- `/account`
- `/account/setting`
- `/admin`
- `/admin/users`
- `/admin/signup`
- `/admin/user/:uid/:aid`

Backend API routes:

- `POST /1/contact/`
- `POST /1/signup/`
- `POST /1/login/`
- `POST /1/login/forgot/`
- `PUT /1/login/reset/:email/:token/`
- `GET /1/account`
- `GET /1/account/user`
- `PUT /1/account/settings/`
- `PUT /1/account/settings/identity/`
- `PUT /1/account/settings/password/`
- `GET /1/admin/count`
- `GET /1/admin/users`
- `POST /1/admin/signup/`
- `GET /1/admin/account/:id`
- `GET /1/admin/user/:id`
- `PUT /1/admin/account/:id`
- `PUT /1/admin/user/:id`
- `PUT /1/admin/user/:id/password`
- `DELETE /1/admin/users/:id`

Example post routes:

- `GET /1/post`
- `POST /1/post`
- `POST /1/post/query`
- `PUT /1/post/:name/publish`
- `PUT /1/post/:name/unpublish`
- `DELETE /1/post/:id`
- `POST /2/post`
- `PUT /2/post/:id`

## API Docs

The project includes an interactive Swagger UI for exploring and testing all backend API endpoints.

The docs are served at `/api-docs` and are **only enabled** when both of the following environment variables are set:

- `SWAGGER_USER` — Basic Auth username
- `SWAGGER_PASSWORD` — Basic Auth password

Once set, open `http://localhost:3001/api-docs` in your browser and enter the credentials to access the documentation.

If neither variable is configured, the `/api-docs` route is not registered and the page will not be accessible.

## Scripts

```bash
npm start       # Run Express and Vite together
npm run server  # Run Express with Nodemon
npm run client  # Run Vite dev server
npm run build   # Build the frontend with Vite
npm run preview # Preview the Vite production build
npm test        # Run StandardJS
npm run db:init # Seed the root admin account and related records
```

## Production Build

Build the frontend:

```bash
npm run build
```

Vite outputs production assets to `dist/` by default. The Express server
currently serves `build/` and falls back to `build/index.html`, so deployment
should either copy the Vite output into `build/` or update `app.js` / Vite
configuration so both use the same output directory.

## Project Structure

```text
app.js                  Express application entry point
routes.js               API route registration and role guards
config.example.js        Example runtime configuration
db-scripts/init-db.js    Root admin database initializer
controllers/             API controllers and email templates
schema/                  Mongoose schemas and plugins
util/                    Shared server utilities
src/                     React application
src/layouts/             Default, account, and admin layouts
src/login/               Login, signup, reset, and forgot-password views
src/account/             Account dashboard and settings views
src/admin/               Admin dashboard and user management views
src/utils/               Client auth, HTTP, and Redux helpers
public/                  Static public assets
```

## Code Style

The project uses [StandardJS](https://standardjs.com/):

```bash
npm test
```

## License

MIT
