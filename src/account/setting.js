import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import DetailsForm from './details-form'
import UserForm from './user-form'
import PasswordForm from './password-form'

class SettingsPage extends Component {
  render () {
    return (
      <Container>
        <Helmet>
          <title>帳號設定</title>
        </Helmet>
        <h1 className='page-header'>帳號設定</h1>
        <Row>
          <Col sm={6}>
            <DetailsForm />
            <UserForm />
            <PasswordForm />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default SettingsPage
