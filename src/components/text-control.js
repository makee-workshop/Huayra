import ClassNames from 'classnames'
import ControlGroup from './control-group'
import ObjectAssign from 'object-assign'
import PropTypes from 'prop-types'
import React from 'react'

const propTypes = {
  autoCapitalize: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  help: PropTypes.string,
  inputClasses: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}
const defaultProps = {
  type: 'text',
  autoCapitalize: 'off'
}

class TextControl extends React.Component {
  focus () {
    return this.input.focus()
  }

  value () {
    return this.input.value
  }

  render () {
    const inputClasses = ClassNames(ObjectAssign({
      'form-control': true
    }, this.props.inputClasses))

    return (
      <ControlGroup
        hasError={this.props.hasError}
        label={this.props.label}
        help={this.props.help}>

        <input
          ref={(c) => (this.input = c)}
          type={this.props.type}
          autoCapitalize={this.props.autoCapitalize}
          className={inputClasses}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.props.value}
          disabled={this.props.disabled ? 'disabled' : undefined}
          onChange={this.props.onChange}
        />
      </ControlGroup>
    )
  }
}

TextControl.propTypes = propTypes
TextControl.defaultProps = defaultProps

export default TextControl
