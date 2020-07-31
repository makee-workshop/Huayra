import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import DetailsForm from './details-form'
import UserForm from './user-form'
import PasswordForm from './password-form'

class UserSettingsPage extends Component {
  render () {
    return (
      <Container>
        <Helmet>
          <title> {this.props.match.params.username} 帳號設定 </title>
        </Helmet>

        <h1 className='page-header'> {this.props.match.params.username} 帳號設定 </h1>
        <Row>
          <Col sm={6}>
            <DetailsForm aid={this.props.match.params.aid} />
            <UserForm uid={this.props.match.params.uid} />
            <PasswordForm uid={this.props.match.params.uid} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default UserSettingsPage
