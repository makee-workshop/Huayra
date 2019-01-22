import React, { Component } from 'react'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'
import SelectControl from '../components/select-control'

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
      isActive: 'no',
      username: '',
      email: ''
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    fetch('/1/admin/user/' + this.props.uid, {
      credentials: 'include',
      mode: 'cors'
    })
      .then(r => r.json())
      .then(r => {
        this.setState({
          username: r.data.username,
          email: r.data.email,
          isActive: r.data.isActive
        })
      })
      .catch(e => {
        console.error(e)
      })
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
      isActive: this.input.isActive.value(),
      username: this.input.username.value(),
      email: this.input.email.value()
    })

    let sentData = {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      header: header,
      body: data
    }

    fetch('/1/admin/user/' + this.props.uid, sentData)
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
        <fieldset>
          <legend> 帳號資料 </legend>
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
          <SelectControl
            ref={(c) => (this.input.isActive = c)}
            name="isActive"
            label="是否啟用"
            value={this.state.isActive}
            onChange={(e) => (this.setState({ isActive: e.target.value }))}
            hasError={this.state.hasError.isActive}
            help={this.state.help.isActive}
            disabled={this.state.loading}
          >
            <option value="yes">啟用</option>
            <option value="no">關閉</option>
          </SelectControl>
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

export default UserForm