import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'

export function requireWeakAuth (Component) {
  const AuthenticatedComponent = (props) => {
    useEffect(() => {
      const checkAuth = () => {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const jwtPayload = JSON.parse(decodeURIComponent(escape(window.atob((token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/')))))
            if (jwtPayload._id && jwtPayload.roles.account) {
              let role = 'account'
              if (jwtPayload.roles.admin) {
                role = 'admin'
              }
              props.loginSuccess({
                authenticated: true,
                user: jwtPayload.username,
                email: jwtPayload.email,
                role
              })
            } else {
              localStorage.removeItem('token')
            }
          }
        } catch (_error) {
          localStorage.removeItem('token')
        }
      }

      checkAuth()
    }, [props])

    return (
      <div>
        <Component {...props} />
      </div>
    )
  }

  const mapStateToProps = (state) => ({
    user: state.index.user,
    authenticated: state.index.authenticated
  })

  const mapDispatchToProps = (dispatch) => ({
    loginSuccess (user) {
      dispatch(loginSuccess(user))
    },
    loginError () {
      dispatch(loginError())
    }
  })

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}
