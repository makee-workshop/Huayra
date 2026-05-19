import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Container, Row, Col } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { post } from '../utils/httpAgent'
import { loginSuccess, loginError } from '../utils/reducer'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const Login = () => {
  const dispatch = useDispatch()
  const inputRef = useRef({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})
  const [role, setRole] = useState('')
  const [returnUrl, setReturnUrl] = useState('')

  const getParameterByName = (name) => {
    name = name.replace(/[[\]]/g, '\\$&')
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    const results = regex.exec(window.location.href)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  useEffect(() => {
    setReturnUrl(getParameterByName('returnUrl'))
    if (inputRef.current.username) {
      inputRef.current.username.focus()
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    post('/1/login', {
      username: inputRef.current.username.value(),
      password: inputRef.current.password.value()
    })
      .then((response) => {
        if (response.success === true) {
          localStorage.setItem('token', response.data.token)
          delete response.data.token
          dispatch(loginSuccess(response.data))
          setSuccess(true)
          setError('')
          setLoading(false)
          setRole(response.data.role)
        } else {
          const newState = {
            success: false,
            error: '',
            loading: false,
            hasError: {},
            help: {}
          }
          for (const key in response.errfor) {
            newState.hasError[key] = true
            newState.help[key] = response.errfor[key]
          }

          if (response.errors[0] !== undefined) {
            newState.error = response.errors[0]
          }
          setHasError(newState.hasError)
          setHelp(newState.help)
          setError(newState.error)
          setLoading(newState.loading)
          dispatch(loginError())
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  if (success && returnUrl) {
    return <Navigate to={returnUrl} replace />
  } else if (success && role === 'account') {
    return <Navigate to='/account' replace />
  } else if (success && role === 'admin') {
    return <Navigate to='/admin' replace />
  }

  let alerts = null

  if (error) {
    alerts = <Alert type='danger' message={error} />
  }

  return (
    <Container>
      <Helmet>
        <title>登入</title>
      </Helmet>

      <h1 className='page-header'>登入</h1>
      <Row>
        <Col sm={6}>
          <form onSubmit={handleSubmit}>
            {alerts}
            <TextControl
              ref={(c) => (inputRef.current.username = c)}
              name='username'
              label='帳號'
              hasError={hasError.username}
              help={help.username}
              disabled={loading}
              onKeyPress={handleKeyPress}
            />
            <TextControl
              ref={(c) => (inputRef.current.password = c)}
              name='password'
              label='密碼'
              type='password'
              hasError={hasError.password}
              help={help.password}
              disabled={loading}
              onKeyPress={handleKeyPress}
            />
            <ControlGroup hideLabel hideHelp>
              <Button type='submit' inputClasses={{ 'btn-primary': true }} disabled={loading}>
                登入
                <Spinner space='left' show={loading} />
              </Button>
              <Link to='/login/forgot' className='btn btn-link'>
                忘記密碼?
              </Link>
            </ControlGroup>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
