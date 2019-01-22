import React from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'

export function requireAdminAuth(Component) {

  class AuthenticatedComponent extends Component {

    componentDidMount () {
      this.fetchUser()
    }

    compomentDidUpdate () {
      this.fetchUser()
    }

    fetchUser () {
      fetch('/1/islogin', {credentials: 'include', mode: 'cors'})
      .then(r => r.json())
      .then(r => {
        if (r.data.authenticated === true && r.data.role === 'admin') {
          this.props.loginSuccess(r.data)
        } else {
          this.props.loginError()
          window.location.assign('/')
        }
      }).catch(e => {
        this.props.loginError()
        console.error(e)
        window.location.assign('/')
      })
    }

    render () {
      return (
        <div>
          { this.props.authenticated === true
            ? <Component {...this.props}/>
            : null
          }
        </div>
      )
    }
  }

  const mapStateToProps = state => ({
    authenticated: state.index.authenticated
  })

  const mapDispatchToProps = dispatch => ({
    loginSuccess (user) {
      dispatch(loginSuccess(user))
    },
    loginError() {
      dispatch(loginError());
    },
  })

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}