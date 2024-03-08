import React, { useState, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'
import TextareaControl from '../components/textarea-control'

const Contact = () => {
  const inputRef = useRef({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    const header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    const data = new URLSearchParams({
      name: inputRef.current.name.value(),
      email: inputRef.current.email.value(),
      message: inputRef.current.message.value()
    })

    const sentData = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      header,
      body: data
    }

    fetch('/1/contact/', sentData)
      .then((response) => response.json())
      .then((response) => {
        if (response.success === true) {
          setSuccess(true)
          setError('')
          setLoading(false)
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
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  let alert = null
  if (success) {
    alert = <Alert type='success' message='訊息已成功傳送。' />
  } else if (error) {
    alert = <Alert type='danger' message={error} />
  }

  return (
    <Container>
      <Helmet>
        <title>連絡我們</title>
      </Helmet>
      <Row>
        <Col sm={6}>
          <h1 className='page-header'>傳送訊息</h1>
          <form onSubmit={handleSubmit}>
            {alert}
            <TextControl
              ref={(c) => (inputRef.current.name = c)}
              name='稱呼'
              label='您的稱呼'
              hasError={hasError.name}
              help={help.name}
              disabled={loading}
            />
            <TextControl
              ref={(c) => (inputRef.current.email = c)}
              name='email'
              label='您的 email'
              hasError={hasError.email}
              help={help.email}
              disabled={loading}
            />
            <TextareaControl
              ref={(c) => (inputRef.current.message = c)}
              name='message'
              label='訊息'
              rows='5'
              hasError={hasError.message}
              help={help.message}
              disabled={loading}
            />
            <ControlGroup hideLabel hideHelp>
              <Button type='submit' inputClasses={{ 'btn-primary': true }} disabled={loading}>
                傳送
                <Spinner space='left' show={loading} />
              </Button>
            </ControlGroup>
          </form>
        </Col>
        <Col sm={6} className='text-center'>
          <h1 className='page-header'>連絡我們</h1>
          <p className='lead'>Makee can’t wait to hear from you.</p>
          <i className='lnr lnr-envelope bamf' />
          <div>Taiwan Taipei</div>
        </Col>
      </Row>
    </Container>
  )
}

export default Contact
