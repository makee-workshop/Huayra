import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginSuccess, loginError } from '../utils/userAction'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { Redirect } from 'react-router'
import { post } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

class Signup extends Component {
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

    post('/1/signup/', {
      username: this.input.username.value(),
      email: this.input.email.value(),
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
      }
    )
  }

  render () {
    let alert = []
    const isIE = (navigator.userAgent.search('Trident') || navigator.userAgent.search('MSIE')) > -1

    if (this.state.success) {
      return (<Redirect to='/account' />)
    } else if (this.props.authenticated) {
      return (<Redirect to='/' />)
    }

    if (isIE) {
      this.setState({
        success: false,
        error: '本服務目前不支援 Internet Explorer 瀏覽器，請切換其他瀏覽器後繼續使用。',
        loading: true
      })
    }

    if (this.state.success) {
      alert = <Alert
        type='success'
        message='成功，請稍後...'
      />
    } else if (this.state.error) {
      alert = <Alert
        type='danger'
        message={this.state.error}
      />
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
              <form onSubmit={this.handleSubmit.bind(this)}>
                {alert}
                <TextControl
                  ref={(c) => (this.input.username = c)}
                  name='username'
                  label='帳號'
                  hasError={this.state.hasError.username}
                  help={this.state.help.username}
                  disabled={this.state.loading}
                />
                <TextControl
                  ref={(c) => (this.input.email = c)}
                  name='email'
                  label='Email'
                  hasError={this.state.hasError.email}
                  help={this.state.help.email}
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
                    inputClasses={{ 'btn-success': true }}
                    disabled={this.state.loading}>
                    建立帳號
                    <Spinner space='left' show={this.state.loading} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
