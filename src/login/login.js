import React, { Component } from 'react'
import { loginSuccess, loginError } from '../utils/userAction'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { post } from '../utils/httpAgent'
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
      role: '',
      returnUrl: ''
    }
  }

  componentDidMount () {
    if (this.input.username) {
      this.input.username.focus()
    }
  }

  getParameterByName (name) {
    name = name.replace(/[[\]]/g, '\\$&')
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    const results = regex.exec(window.location.href)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    this.setState({
      loading: true
    })

    post('/1/login', {
      username: this.input.username.value(),
      password: this.input.password.value()
    }).then(
      r => {
        if (r.success === true) {
          localStorage.setItem('token', r.data.token)
          delete r.data.token
          this.props.loginSuccess(r.data)
          this.setState({
            success: true,
            error: '',
            loading: false,
            role: r.data.role,
            returnUrl: this.getParameterByName('returnUrl')
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
      }
    )
  }

  handleKeyPressn (e) {
    if (e.key === 'Enter') {
      this.setLogin()
    }
  }

  render () {
    if (this.state.success && this.state.returnUrl) {
      return (<Redirect to={this.state.returnUrl} />)
    } else if (this.state.success && this.state.role === 'account') {
      return (<Redirect to='/account' />)
    } else if (this.state.success && this.state.role === 'admin') {
      return (<Redirect to='/admin' />)
    } else if (this.props.authenticated) {
      return (<Redirect to='/' />)
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

    if (this.state.error) {
      alerts = <Alert
        type='danger'
        message={this.state.error}
      />
    }

    return (
      <Container>
        <Helmet>
          <title>登入</title>
        </Helmet>

        <h1 className='page-header'>登入</h1>
        <Row>
          <Col sm={6}>
            <form onSubmit={this.handleSubmit.bind(this)}>
              {alerts}
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
            </form>
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  authenticated: state.index.authenticated
})

const mapDispatchToProps = dispatch => ({
  loginSuccess (user) {
    dispatch(loginSuccess(user))
  },
  loginError () {
    dispatch(loginError())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
