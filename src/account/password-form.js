import React, { Component } from 'react'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

class PasswordForm extends Component {
  constructor (props) {
    super(props)
    this.input = {}
    this.state = {
      loading: false,
      success: false,
      error: undefined,
      hasError: {},
      help: {},
      newPassword: '',
      confirm: ''
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
      newPassword: this.input.newPassword.value(),
      confirm: this.input.confirm.value()
    })

    let sentData = {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      header: header,
      body: data
    }

    fetch('/1/account/settings/password/', sentData)
      .then(r => r.json())
      .then(r => {
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
      }).catch(e => {
        console.error(e)
      })
  } // end handleSubmit

  render () {
    let alerts = []

    if (this.state.success) {
      alerts = <Alert
        type='success'
        message='密碼更新成功'
      />
    } else if (this.state.error) {
      alerts = <Alert
        type='danger'
        message={this.state.error}
      />
    }

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <legend>重設密碼</legend>
          {alerts}
          <TextControl
            ref={(c) => (this.input.newPassword = c)}
            name='newPassword'
            label='新密碼'
            hasError={this.state.hasError.newPassword}
            help={this.state.help.newPassword}
            disabled={this.state.loading}
          />
          <TextControl
            ref={(c) => (this.input.confirm = c)}
            name='confirm'
            label='再次輸入新密碼'
            hasError={this.state.hasError.confirm}
            help={this.state.help.confirm}
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
        </fieldset>
      </form>
    )
  }
}

export default PasswordForm
