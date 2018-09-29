import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'
import TextareaControl from '../components/textarea-control'

class index extends Component {
  constructor (props) {
    super(props)
    this.input = {}
    this.state = {
      loading: false,
      success: false,
      error: undefined,
      hasError: {},
      help: {}
    }
  }

  componentDidMount () {
    if (this.input.name) {
      this.input.name.focus()
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    this.setState({
      loading: true
    })

    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    let data = new URLSearchParams({
      name: this.input.name.value(),
      email: this.input.email.value(),
      message: this.input.message.value()
    })

    let sentData = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      header: header,
      body: data
    }

    fetch('/1/contact/', sentData)
      .then(r => r.json())
      .then(r => {
        if (r.success === true) {
          this.setState({
            success: true,
            error: '',
            loading: false
          })
        } else {
          let state = {
            success: false,
            error: '',
            loading: false,
            hasError: {},
            help: {}
          }
          for (let key in r.errfor) {
            state.hasError[key] = true
            state.help[key] = r.errfor[key]
          }

          if (r.errors[0] !== undefined) {
            state.error = r.errors[0]
          }
          this.setState(state)
        }
      }).catch(e => {
        console.error(e)
      })
  }

  render () {
    let alert = []
    let formElements

    if (this.state.success) {
      alert = <Alert
        type='success'
        message='訊息已成功傳送。'
      />
    } else if (this.state.error) {
      alert = <Alert
        type='danger'
        message={this.state.error}
      />
    }

    if (!this.state.success) {
      formElements = <fieldset>
        <TextControl
          ref={(c) => (this.input.name = c)}
          name='稱呼'
          label='您的稱呼'
          hasError={this.state.hasError.name}
          help={this.state.help.name}
          disabled={this.state.loading}
        />
        <TextControl
          ref={(c) => (this.input.email = c)}
          name='email'
          label='您的 email'
          hasError={this.state.hasError.email}
          help={this.state.help.email}
          disabled={this.state.loading}
        />
        <TextareaControl
          ref={(c) => (this.input.message = c)}
          name='message'
          label='訊息'
          rows='5'
          hasError={this.state.hasError.message}
          help={this.state.help.message}
          disabled={this.state.loading}
        />
        <ControlGroup hideLabel hideHelp>
          <Button
            type='submit'
            inputClasses={{ 'btn-primary': true }}
            disabled={this.state.loading}>
            傳送
            <Spinner space='left' show={this.state.loading} />
          </Button>
        </ControlGroup>
      </fieldset>
    }

    return (
      <section className='section-contact container'>
        <Helmet>
          <title>連絡我們</title>
        </Helmet>
        <div className='row'>
          <div className='col-sm-6'>
            <section>
              <h1 className='page-header'>傳送訊息</h1>
              <form onSubmit={this.handleSubmit.bind(this)}>
                {alert}
                {formElements}
              </form>
            </section>
          </div>
          <div className='col-sm-6 text-center'>
            <h1 className='page-header'>連絡我們</h1>
            <p className='lead'>
              Makee can’t wait to hear from you.
            </p>
            <i className='fa fa-reply-all bamf' />
            <div>
              Taiwan Taipei
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default index
