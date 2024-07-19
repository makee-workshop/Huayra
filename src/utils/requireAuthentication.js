import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'
import { useHistory, useLocation } from 'react-router-dom'

const requireAuthentication = (Component) => {
  const AuthenticatedComponent = ({ loginError, ...restProps }) => {
    const history = useHistory()
    const location = useLocation()

    const handleLoginError = useCallback(() => {
      loginError()
      if (location.pathname === '/') {
        history.replace('/')
      } else {
        history.replace(`/?returnUrl=${location.pathname}`)
      }
    }, [loginError, history, location])

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (token) {
        const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
        if (!jwtPayload._id || !jwtPayload.roles.account) {
          handleLoginError()
        } else {
          let role = 'account'
          if (jwtPayload.roles.admin) {
            role = 'admin'
          }
          restProps.loginSuccess({
            authenticated: true,
            user: jwtPayload.username,
            email: jwtPayload.email,
            role
          })
        }
      } else {
        handleLoginError()
      }
    }, [handleLoginError])

    return <Component {...restProps} />
  }

  const mapDispatchToProps = (dispatch) => ({
    loginSuccess: (user) => dispatch(loginSuccess(user)),
    loginError: () => dispatch(loginError())
  })

  return connect(null, mapDispatchToProps)(AuthenticatedComponent)
}

export default requireAuthentication
