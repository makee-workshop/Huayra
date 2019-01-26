import React from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'
import { get } from './httpAgent'

export function requireAdminAuth (Component) {
  class AuthenticatedComponent extends Component {
    componentDidMount () {
      this.fetchUser()
    }

    compomentDidUpdate () {
      this.fetchUser()
    }

    fetchUser () {
      get('/1/islogin')
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
          {this.props.authenticated === true
            ? <Component {...this.props} />
            : null}
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
    loginError () {
      dispatch(loginError())
    }
  })

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}
