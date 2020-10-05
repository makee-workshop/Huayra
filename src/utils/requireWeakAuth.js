import React from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from './userAction'

export function requireWeakAuth (Component) {
  class AuthenticatedComponent extends Component {
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
