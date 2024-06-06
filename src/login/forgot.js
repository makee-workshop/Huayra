import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { post } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const ForgotPage = ({ authenticated }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})
  const emailRef = useRef(null)

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus()
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    post('/1/login/forgot/', {
      email: emailRef.current.value()
    }).then((r) => {
      if (r.success === true) {
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
        for (const key in r.errfor) {
          state.hasError[key] = true
          state.help[key] = r.errfor[key]
        }

        if (r.errors[0] !== undefined) {
          state.error = r.errors[0]
        }
        setSuccess(state.success)
        setError(state.error)
        setLoading(state.loading)
        setHasError(state.hasError)
        setHelp(state.help)
      }
    })
  }

  let alert = []
  if (success) {
    alert = (
      <div key='success'>
        <Alert
          type='success'
          message='若此帳號存在，您將會收到一封重置的 email。'
        />
        <Link to='/login' className='btn btn-link'>
          返回登入
        </Link>
      </div>
    )
  } else if (authenticated) {
    return <Redirect to='/' />
  } else if (error) {
    alert = <Alert type='danger' message={error} />
  }

  return (
    <Container>
      <Helmet>
        <title>忘記密碼</title>
      </Helmet>

      <h1 className='page-header'>忘記您的密碼?</h1>
      <Row>
        <Col sm={6}>
          <form onSubmit={handleSubmit}>
            {alert}
            <TextControl
              ref={emailRef}
              name='email'
              label='您帳號的 email 是?'
              hasError={hasError.email}
              help={help.email}
              disabled={loading}
            />
            <ControlGroup hideLabel hideHelp>
              <Button
                type='submit'
                inputClasses={{ 'btn-primary': true }}
                disabled={loading}
              >
                重置
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

export default connect(mapStateToProps, null)(ForgotPage)
