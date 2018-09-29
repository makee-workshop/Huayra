import React from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'

export function requireAuthentication (Component) {
  class AuthenticatedComponent extends Component {
    componentDidMount () {
      this.fetchUser()
    }

    compomentDidUpdate () {
      this.fetchUser()
    }

    fetchUser () {
      fetch('/1/islogin', { credentials: 'include', mode: 'cors' })
        .then(r => r.json())
        .then(r => {
          if (r.data.authenticated === true) {
            this.props.loginSuccess(r.data)
            localStorage.setItem('auth', true)
            localStorage.setItem('role', r.data.role)
          } else {
            this.props.loginError()
            localStorage.setItem('auth', false)
            localStorage.setItem('role', '')
            window.location.assign('/login')
          }
        }).catch(e => {
          this.props.loginError()
          console.error(e)
          localStorage.setItem('auth', false)
          localStorage.setItem('role', '')
          window.location.assign('/login')
        })
    }

    render () {
      return (
        <div>
          {localStorage.getItem('auth') === 'true'
            ? <Component {...this.props} />
            : null}
        </div>
      )
    }
  }

  const mapDispatchToProps = dispatch => ({
    loginSuccess (user) {
      dispatch(loginSuccess(user))
    },
    loginError () {
      dispatch(loginError())
    }
  })

  return connect(null, mapDispatchToProps)(AuthenticatedComponent)
}
