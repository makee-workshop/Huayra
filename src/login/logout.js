import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { get } from '../utils/httpAgent'
import { loginError } from '../utils/reducer'

const Logout = () => {
  const dispatch = useDispatch()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    get('/1/account/logout').then(() => {
      localStorage.removeItem('token')
      setSuccess(true)
    })
    dispatch(loginError())
  }, [dispatch])

  return success ? <Navigate to='/' replace /> : null
}

export default Logout
