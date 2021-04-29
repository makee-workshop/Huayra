import React from 'react'
import { connect } from 'react-redux'
import { loginError } from './userAction'

export function requireAdminAuth (Component) {
  class AuthenticatedComponent extends React.Component {
    componentDidMount () {
      try {
        var token = localStorage.getItem('token')
        if (token) {
          const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
          if (!jwtPayload._id || !jwtPayload.roles.admin) {
            this.loginError()
          }
        } else {
          this.loginError()
        }
      } catch (_error) {
        this.loginError()
      }
    }

    loginError () {
      this.props.loginError()
      if (window.location.pathname === '/') {
        window.location.assign('/')
      } else {
        window.location.assign(`/login?returnUrl=${window.location.pathname}`)
      }
    }

    render () {
      return (
        <Component {...this.props} />
      )
    }
  }

  const mapDispatchToProps = dispatch => ({
    loginError () {
      dispatch(loginError())
    }
  })

  return connect(null, mapDispatchToProps)(AuthenticatedComponent)
}
