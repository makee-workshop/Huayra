import React, { Component } from 'react'
import { loginSuccess, loginError } from '../utils/userAction'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

class Login extends Component {
  constructor (props) {
    super(props)
    this.input = {}
    this.state = {
      loading: false,
      success: false,
      error: undefined,
      hasError: {},
      help: {},
      role: ''
    }
  }

  componentDidMount () {
    if (this.input.username) {
      this.input.username.focus()
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
      username: this.input.username.value(),
      password: this.input.password.value()
    })

    let sentData = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      header: header,
      body: data
    }

    fetch('/1/login', sentData)
      .then(r => r.json())
      .then(r => {
        if (r.success === true) {
          this.props.loginSuccess(r.data)
          this.setState({
            success: true,
            error: '',
            loading: false,
            role: r.data.role
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
          this.props.loginError()
        }
      }).catch(e => {
        console.error(e)
        this.props.loginError()
        this.setState({
          loginErrorType: 2
        })
      })
  }

  handleKeyPressn (e) {
    if (e.key === 'Enter') {
      this.setLogin()
    }
  }

  render () {
    if (this.state.success && this.state.role == 'account') {
      return (<Redirect to='/account' />)
    } else if (this.state.success && this.state.role == 'admin') {
      return (<Redirect to='/admin' />)
    }

    let alerts = []
    const isIE = (navigator.userAgent.search('Trident') || navigator.userAgent.search('MSIE')) > -1

    if (isIE) {
      this.setState({
        success: false,
        error: '本服務目前不支援 Internet Explorer 瀏覽器，請切換其他瀏覽器後繼續使用。',
        disabled: 'disabled'
      })
    }

    if (this.state.success) {
      alerts = <Alert
        type='success'
        message='成功，請稍後...'
      />
    } else if (this.state.error) {
      alerts = <Alert
        type='danger'
        message={this.state.error}
      />
    }

    let formElements

    if (!this.state.success) {
      formElements = <fieldset>
        <TextControl
          ref={(c) => (this.input.username = c)}
          name='username'
          label='帳號'
          hasError={this.state.hasError.username}
          help={this.state.help.username}
          disabled={this.state.loading}
        />
        <TextControl
          ref={(c) => (this.input.password = c)}
          name='password'
          label='密碼'
          type='password'
          hasError={this.state.hasError.password}
          help={this.state.help.password}
          disabled={this.state.loading}
        />
        <ControlGroup hideLabel hideHelp>
          <Button
            type='submit'
            inputClasses={{ 'btn-primary': true }}
            disabled={this.state.loading}>
                  登入
            <Spinner space='left' show={this.state.loading} />
          </Button>
          <Link to='/login/forgot' className='btn btn-link'>忘記密碼?</Link>
        </ControlGroup>
      </fieldset>
    }

    return (
      <section className='container'>
        <Helmet>
          <title>登入</title>
        </Helmet>
        <div className='container'>
          <h1 className='page-header'>登入</h1>
          <div className='row'>
            <div className='col-sm-6'>
              <form onSubmit={this.handleSubmit.bind(this)}>
                {alerts}
                {formElements}
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loginSuccess (user) {
    dispatch(loginSuccess(user))
  },
  loginError () {
    dispatch(loginError())
  }
})

export default connect(null, mapDispatchToProps)(Login)
