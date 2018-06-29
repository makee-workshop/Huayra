import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import DetailsForm from './details-form'
import UserForm from './user-form'
import PasswordForm from './password-form'

class SettingsPage extends Component {

  render() {
    return (
      <section className="container">
        <Helmet>
          <title>帳號設定</title>
        </Helmet>
        <h1 className="page-header">帳號設定</h1>
        <div className="row">
          <div className="col-sm-6">
            <DetailsForm />
            <UserForm />
            <PasswordForm />
          </div>
        </div>
      </section>
    )
  }
}

export default SettingsPage
