import React from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom'
import DetailsForm from './details-form'
import UserForm from './user-form'
import PasswordForm from './password-form'

const UserSettingsPage = () => {
  const { username, aid, uid } = useParams()

  return (
    <Container>
      <Helmet>
        <title>{username} 帳號設定</title>
      </Helmet>

      <h1 className='page-header'>{username} 帳號設定</h1>
      <Row>
        <Col sm={6}>
          <DetailsForm aid={aid} />
          <UserForm uid={uid} />
          <PasswordForm uid={uid} />
        </Col>
      </Row>
    </Container>
  )
}

export default UserSettingsPage
