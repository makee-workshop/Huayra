import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { Redirect } from 'react-router'
import { put } from '../utils/httpAgent'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const ResetPage = ({ authenticated }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})

  const { email, key } = useParams()

  const passwordInput = useRef(null)
  const confirmInput = useRef(null)

  useEffect(() => {
    if (passwordInput.current) {
      passwordInput.current.focus()
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    try {
      const response = await put(`/1/login/reset/${email}/${key}/`, {
        password: passwordInput.current.value(),
        confirm: confirmInput.current.value(),
        email,
        token: key
      })

      if (response.success === true) {
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

  if (authenticated) {
    return <Redirect to='/' />
  }

  const alerts = []

  if (success) {
    alerts.push(
      <div key='success'>
        <div className='alert alert-success'>您的密碼已重置，請重新登入。</div>
        <Link to='/login' className='btn btn-link'>
          返回登入
        </Link>
      </div>
    )
  }

  if (error) {
    alerts.push(
      <div key='danger' className='alert alert-danger'>
        {error}
      </div>
    )
  }

  return (
    <Container>
      <Helmet>
        <title>重置密碼</title>
      </Helmet>

      <h1 className='page-header'>重置您的密碼</h1>
      <Row>
        <Col sm={6}>
          <form onSubmit={handleSubmit}>
            {alerts}
            <TextControl
              ref={passwordInput}
              name='password'
              label='新密碼'
              type='password'
              hasError={hasError.password}
              help={help.password}
              disabled={loading}
            />
            <TextControl
              ref={confirmInput}
              name='confirm'
              label='再次輸入新密碼'
              type='password'
              hasError={hasError.confirm}
              help={help.confirm}
              disabled={loading}
            />
            <TextControl
              name='_key'
              label='金鑰'
              hasError={hasError.key}
              value={key}
              help={help.key}
              disabled
            />
            <TextControl
              name='_email'
              label='Email'
              hasError={hasError.email}
              value={email}
              help={help.email}
              disabled
            />
            <ControlGroup hideLabel hideHelp>
              <Button
                type='submit'
                inputClasses={{ 'btn-primary': true }}
                disabled={loading}
              >
                設定密碼
                <Spinner space='left' show={loading} />
              </Button>
              <Link to='/login' className='btn btn-link'>
                返回登入
              </Link>
            </ControlGroup>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  authenticated: state.index.authenticated
})

export default connect(mapStateToProps, null)(ResetPage)
