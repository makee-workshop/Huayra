import React, { Component } from 'react'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

class DetailsForm extends Component {
  constructor (props) {
    super(props)
    this.input = {}
    this.state = {
      loading: false,
      success: false,
      error: undefined,
      hasError: {},
      help: {},
      last: '',
      first: '',
      company: '',
      phone: '',
      zip: ''
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    fetch('/1/account', {
      credentials: 'include',
      mode: 'cors'
    })
      .then(r => r.json())
      .then(r => {
        this.setState({
          first: r.data.name.first,
          last: r.data.name.last,
          company: r.data.company,
          phone: r.data.phone,
          zip: r.data.zip
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
      last: this.input.last.value(),
      first: this.input.first.value(),
      company: this.input.company.value(),
      phone: this.input.phone.value(),
      zip: this.input.zip.value()
    })

    let sentData = {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      header: header,
      body: data
    }

    fetch('/1/account/settings/', sentData)
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
        message='個人資料更新成功'
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
          <legend>個人資料</legend>
          {alerts}
          <TextControl
            ref={(c) => (this.input.last = c)}
            name='last'
            label='姓氏'
            value={this.state.last}
            onChange={(e) => (this.setState({ last: e.target.value }))}
            hasError={this.state.hasError.last}
            help={this.state.help.last}
            disabled={this.state.loading}
          />
          <TextControl
            ref={(c) => (this.input.first = c)}
            name='first'
            label='名字'
            value={this.state.first}
            onChange={(e) => (this.setState({ first: e.target.value }))}
            hasError={this.state.hasError.first}
            help={this.state.help.first}
            disabled={this.state.loading}
          />
          <TextControl
            ref={(c) => (this.input.company = c)}
            name='company'
            label='公司'
            value={this.state.company}
            onChange={(e) => (this.setState({ company: e.target.value }))}
            hasError={this.state.hasError.company}
            help={this.state.help.company}
            disabled={this.state.loading}
          />
          <TextControl
            ref={(c) => (this.input.phone = c)}
            name='phone'
            label='電話'
            value={this.state.phone}
            onChange={(e) => (this.setState({ phone: e.target.value }))}
            hasError={this.state.hasError.phone}
            help={this.state.help.phone}
            disabled={this.state.loading}
          />
          <TextControl
            ref={(c) => (this.input.zip = c)}
            name='zip'
            label='郵遞區號'
            value={this.state.zip}
            onChange={(e) => (this.setState({ zip: e.target.value }))}
            hasError={this.state.hasError.zip}
            help={this.state.help.zip}
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

export default DetailsForm
