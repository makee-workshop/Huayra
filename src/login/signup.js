import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { loginSuccess } from '../utils/userAction'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { Redirect } from 'react-router'
import { post } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const SignupPage = ({ authenticated, loginSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})

  const usernameInput = useRef(null)
  const emailInput = useRef(null)
  const passwordInput = useRef(null)

  useEffect(() => {
    if (usernameInput.current) {
      usernameInput.current.focus()
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    try {
      const response = await post('/1/signup/', {
        username: usernameInput.current.value(),
        email: emailInput.current.value(),
        password: passwordInput.current.value()
      })

      if (response.success === true) {
        localStorage.setItem('token', response.data.token)
        delete response.data.token
        loginSuccess(response.data)
        setSuccess(true)
        setError('')
        setLoading(false)
      } else {
        const state = {
          success: false,
          error: '',
          loading: false,
          hasError: {},
          help: {}
        }

        for (const key in response.errfor) {
          state.hasError[key] = true
          state.help[key] = response.errfor[key]
        }

        if (response.errors[0] !== undefined) {
          state.error = response.errors[0]
        }

        setHasError(state.hasError)
        setHelp(state.help)
        setError(state.error)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      setError('出現錯誤，請稍後再試。')
      setLoading(false)
    }
  }

  if (success) {
    return <Redirect to='/account' />
  } else if (authenticated) {
    return <Redirect to='/' />
  }

  let alert = null

  if (success) {
    alert = <Alert type='success' message='成功，請稍後...' />
  } else if (error) {
    alert = <Alert type='danger' message={error} />
  }

  return (
    <Container>
      <Helmet>
        <title>註冊</title>
      </Helmet>

      <Row>
        <Col sm={6}>
          <section>
            <h1 className='page-header'>註冊</h1>
            <form onSubmit={handleSubmit}>
              {alert}
              <TextControl
                ref={usernameInput}
                name='username'
                label='帳號'
                hasError={hasError.username}
                help={help.username}
                disabled={loading}
              />
              <TextControl
                ref={emailInput}
                name='email'
                label='Email'
                hasError={hasError.email}
                help={help.email}
                disabled={loading}
              />
              <TextControl
                ref={passwordInput}
                name='password'
                label='密碼'
                type='password'
                hasError={hasError.password}
                help={help.password}
                disabled={loading}
              />
              <ControlGroup hideLabel hideHelp>
                <Button
                  type='submit'
                  inputClasses={{ 'btn-success': true }}
                  disabled={loading}
                >
                  建立帳號
                  <Spinner space='left' show={loading} />
                </Button>
              </ControlGroup>
            </form>
          </section>
        </Col>
        <Col sm={6} className='text-center'>
          <h1 className='page-header'>加入我們</h1>
          <p className='lead'>
            不渴望能夠一躍千里，只希望每天能夠前進一步。
          </p>
          <i className='lnr lnr-rocket bamf' />
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  authenticated: state.index.authenticated
})

const mapDispatchToProps = (dispatch) => ({
  loginSuccess (user) {
    dispatch(loginSuccess(user))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage)
