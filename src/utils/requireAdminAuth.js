import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'

export function requireAdminAuth (Component) {
  const AuthenticatedComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
      const checkAuth = () => {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const jwtPayload = JSON.parse(decodeURIComponent(escape(window.atob((token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/')))))
            if (!jwtPayload._id || !jwtPayload.roles.admin) {
              loginErrorHandler()
            } else {
              props.loginSuccess({
                authenticated: true,
                user: jwtPayload.username,
                email: jwtPayload.email,
                role: 'admin'
              })
              setIsAuthenticated(true)
            }
          } else {
            loginErrorHandler()
          }
        } catch (_error) {
          loginErrorHandler()
        }
      }

      const loginErrorHandler = () => {
        props.loginError()
        if (window.location.pathname === '/') {
          window.location.assign('/')
        } else {
          window.location.assign(`/?returnUrl=${window.location.pathname}`)
        }
      }

      checkAuth()
    }, [props])

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }

  const mapDispatchToProps = (dispatch) => ({
    loginSuccess (user) {
      dispatch(loginSuccess(user))
    },
    loginError () {
      dispatch(loginError())
    }
  })

  return connect(null, mapDispatchToProps)(AuthenticatedComponent)
}
