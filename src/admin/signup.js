import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router'
import { post } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})

  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    post('/1/admin/signup/', {
      username: usernameRef.current.value(),
      email: emailRef.current.value(),
      password: passwordRef.current.value()
    }).then(r => {
      if (r.success === true) {
        setSuccess(true)
        setError('')
        setLoading(false)
      } else {
        const newHasError = {}
        const newHelp = {}
        for (const key in r.errfor) {
          newHasError[key] = true
          newHelp[key] = r.errfor[key]
        }

        setSuccess(false)
        setError(r.errors[0] !== undefined ? r.errors[0] : '')
        setLoading(false)
        setHasError(newHasError)
        setHelp(newHelp)
      }
    })
  }

  if (success) {
    return <Redirect to='/admin/users' />
  }

  const alert = error
    ? (
      <Alert
        type='danger'
        message={error}
      />
      )
    : null

  return (
    <section className='section-home container'>
      <Helmet>
        <title>建立用戶</title>
      </Helmet>

      <div className='row'>
        <div className='col-md-12'>
          <section>
            <h1 className='page-header'>建立用戶</h1>
            <form onSubmit={handleSubmit}>
              {alert}
              <TextControl
                ref={usernameRef}
                name='username'
                label='帳號'
                hasError={hasError.username}
                help={help.username}
                disabled={loading}
              />
              <TextControl
                ref={emailRef}
                name='email'
                label='Email'
                hasError={hasError.email}
                help={help.email}
                disabled={loading}
              />
              <TextControl
                ref={passwordRef}
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
                  建立
                  <Spinner space='left' show={loading} />
                </Button>
              </ControlGroup>
            </form>
          </section>
        </div>
      </div>
    </section>
  )
}

export default Signup
