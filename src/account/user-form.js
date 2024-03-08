import React, { Component } from 'react'
import { get, put } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

class UserForm extends Component {
  constructor (props) {
    super(props)
    this.input = {}
    this.state = {
      loading: false,
      success: false,
      error: undefined,
      hasError: {},
      help: {},
      username: '',
      email: ''
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    get('/1/user')
      .then(r => {
        if (r.data) {
          this.setState({
            username: r.data.username,
            email: r.data.email
          })
        }
      })
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    this.setState({
      loading: true
    })

    put('/1/account/settings/identity/', {
      username: this.input.username.value(),
      email: this.input.email.value()
    }).then(r => {
      if (r.success === true) {
        this.setState({
          success: true,
          error: '',
          loading: false,
          hasError: {}
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
    })
  } // end handleSubmit

  render () {
    let alerts = []

    if (this.state.success) {
      alerts = <Alert
        type='success'
        message='帳號資料更新成功'
      />
    } else if (this.state.error) {
      alerts = <Alert
        type='danger'
        message={this.state.error}
      />
    }

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <legend>帳號資料</legend>
        {alerts}
        <TextControl
          ref={(c) => (this.input.username = c)}
          name='username'
          label='帳號'
          value={this.state.username}
          onChange={(e) => (this.setState({ username: e.target.value }))}
          hasError={this.state.hasError.username}
          help={this.state.help.username}
          disabled={this.state.loading}
        />
        <TextControl
          ref={(c) => (this.input.email = c)}
          name='email'
          label='email'
          value={this.state.email}
          onChange={(e) => (this.setState({ email: e.target.value }))}
          hasError={this.state.hasError.email}
          help={this.state.help.email}
          disabled={this.state.loading}
        />
        <ControlGroup hideLabel hideHelp>
          <Button
            type='submit'
            inputClasses={{ 'btn-primary': true }}
            disabled={this.props.loading}>
            更新
            <Spinner
              space='left'
              show={this.props.loading}
            />
          </Button>
        </ControlGroup>
      </form>
    )
  }
}

export default UserForm
