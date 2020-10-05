import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { Redirect } from 'react-router'
import { put } from '../utils/httpAgent'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

class ResetPage extends Component {
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
    if (this.input.password) {
      this.input.password.focus()
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    this.setState({
      loading: true
    })

    put('/1/login/reset/' + this.props.match.params.email + '/' +
    this.props.match.params.key + '/', {
      password: this.input.password.value(),
      confirm: this.input.confirm.value(),
      email: this.props.match.params.email,
      token: this.props.match.params.key
    }).then(
      r => {
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
      }
    )
  }

  render () {
    let alerts = []
    const isIE = (navigator.userAgent.search('Trident') || navigator.userAgent.search('MSIE')) > -1

    if (isIE) {
      this.setState({
        success: false,
        error: '本服務目前不支援 Internet Explorer 瀏覽器，請切換其他瀏覽器後繼續使用。',
        loading: true
      })
    }

    if (this.state.success) {
      alerts.push(<div key='success'>
        <div className='alert alert-success'>
          您的密碼已重置，請重新登入。
        </div>
        <Link to='/login' className='btn btn-link'>返回登入</Link>
      </div>)
    } else if (this.props.authenticated) {
      return (<Redirect to='/' />)
    }

    if (this.state.error) {
      alerts.push(<div key='danger' className='alert alert-danger'>
        {this.state.error}
      </div>)
    }

    let formElements

    if (!this.state.success) {
      formElements = <fieldset>
        <TextControl
          ref={(c) => (this.input.password = c)}
          name='password'
          label='新密碼'
          type='password'
          hasError={this.state.hasError.password}
          help={this.state.help.password}
          disabled={this.state.loading}
        />
        <TextControl
          ref={(c) => (this.input.confirm = c)}
          name='confirm'
          label='再次輸入新密碼'
          type='password'
          hasError={this.state.hasError.confirm}
          help={this.state.help.confirm}
          disabled={this.state.loading}
        />
        <TextControl
          name='_key'
          label='金鑰'
          hasError={this.state.hasError.key}
          value={this.props.match.params.key}
          help={this.state.help.key}
          disabled
        />
        <TextControl
          name='_email'
          label='Email'
          hasError={this.state.hasError.email}
          value={this.props.match.params.email}
          help={this.state.help.email}
          disabled
        />
        <ControlGroup hideLabel hideHelp>
          <Button
            type='submit'
            inputClasses={{ 'btn-primary': true }}
            disabled={this.state.loading}>
            設定密碼
            <Spinner space='left' show={this.state.loading} />
          </Button>
          <Link to='/login' className='btn btn-link'>返回登入</Link>
        </ControlGroup>
      </fieldset>
    }

    return (
      <Container>
        <Helmet>
          <title>重置密碼</title>
        </Helmet>

        <h1 className='page-header'>重置您的密碼</h1>
        <Row>
          <Col sm={6}>
            <form onSubmit={this.handleSubmit.bind(this)}>
              {alerts}
              {formElements}
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

export default connect(mapStateToProps, null)(ResetPage)
