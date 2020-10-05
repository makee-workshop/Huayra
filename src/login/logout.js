import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { get } from '../utils/httpAgent'
import { loginError } from '../utils/userAction'

class Logout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      success: false
    }
  }

  componentDidMount () {
    this.fetch()
    this.props.loginError()
  }

  fetch () {
    get('/1/account/logout')
      .then(r => {
        localStorage.removeItem('token')
        this.setState({ success: true })
      })
  }

  render () {
    if (this.state.success) {
      return (<Redirect to='/' />)
    } else {
      return (null)
    }
  }
}

const mapDispatchToProps = dispatch => ({
  loginError () {
    dispatch(loginError())
  }
})

export default connect(null, mapDispatchToProps)(Logout)
