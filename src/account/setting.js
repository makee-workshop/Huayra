import React from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import DetailsForm from './details-form'
import UserForm from './user-form'
import PasswordForm from './password-form'

const SettingsPage = () => {
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

export default SettingsPage
