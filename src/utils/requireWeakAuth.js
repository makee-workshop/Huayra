import React from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'
import { get } from './httpAgent'

export function requireWeakAuth (Component) {
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
          if (r.data.authenticated === true) {
            this.props.loginSuccess(r.data)
          } else {
            this.props.loginError()
          }
        }).catch(e => {
          this.props.loginError()
          console.error(e)
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
