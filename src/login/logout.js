import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { get } from '../utils/httpAgent'
import { loginError } from '../utils/userAction'

class Logout extends Component {
  componentDidMount () {
    this.fetch()
    this.props.loginError()
  }

  fetch () {
    get('/1/logout')
  }

  render () {
    return (
      <Redirect to='/' />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loginError () {
    dispatch(loginError())
  }
})

export default connect(null, mapDispatchToProps)(Logout)
