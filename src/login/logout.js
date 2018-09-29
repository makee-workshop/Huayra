import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { loginError } from '../utils/userAction'

class Logout extends Component {
  componentDidMount () {
    this.fetch()
    localStorage.setItem('auth', false)
    localStorage.setItem('role', '')
    this.props.loginError()
  }

  fetch () {
    fetch('/1/logout', { credentials: 'include', mode: 'cors' })
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
