import React from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'
import { get } from './httpAgent'

export function requireWeakAuth (Component) {
  class AuthenticatedComponent extends React.Component {
    componentDidMount () {
      if (localStorage.getItem('token') && !this.props.user) {
        this.fetchUser()
      }
    }

    fetchUser () {
      get('/1/account/user')
        .then(r => {
          if (r.success) {
            const token = localStorage.getItem('token')
            let role = 'account'
            if (token) {
              const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
              if (jwtPayload.roles.admin) {
                role = 'admin'
              }
            }
            this.props.loginSuccess({
              authenticated: true,
              user: r.data.username,
              email: r.data.email,
              role
            })
          } else {
            this.props.loginError()
          }
        })
    }

    render () {
      return (
        <div>
          <Component {...this.props} />
        </div>
      )
    }
  }

  const mapStateToProps = state => ({
    user: state.index.user,
    authenticated: state.index.authenticated
  })

  const mapDispatchToProps = dispatch => ({
    loginSuccess (user) {
      dispatch(loginSuccess(user))
    },
    loginError () {
      dispatch(loginError())
    }
  })

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}
