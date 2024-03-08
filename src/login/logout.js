import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { get } from '../utils/httpAgent'
import { loginError } from '../utils/userAction'

const Logout = (props) => {
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchLogout()
    props.loginError()
  }, [])

  const fetchLogout = () => {
    get('/1/account/logout')
      .then((response) => {
        localStorage.removeItem('token')
        setSuccess(true)
      })
  }

  return success ? <Redirect to='/' /> : null
}

const mapDispatchToProps = (dispatch) => ({
  loginError: () => {
    dispatch(loginError())
  }
})

export default connect(null, mapDispatchToProps)(Logout)
