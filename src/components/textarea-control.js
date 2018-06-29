import ClassNames from 'classnames'
import ControlGroup from './control-group'
import ObjectAssign from 'object-assign'
import PropTypes from 'prop-types'
import React from 'react'

const propTypes = {
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  help: PropTypes.string,
  inputClasses: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

class TextareaControl extends React.Component {

  focus() {
    return this.input.focus();
  }

  value() {
    return this.input.value;
  }

  render() {
    const inputClasses = ClassNames(ObjectAssign({
      'form-control': true
    }, this.props.inputClasses));

    return (
      <ControlGroup
        hasError={this.props.hasError}
        label={this.props.label}
        help={this.props.help}>

        <textarea
          ref={(c) => (this.input = c)}
          className={inputClasses}
          name={this.props.name}
          rows={this.props.rows}
          placeholder={this.props.placeholder}
          value={this.props.value}
          disabled={this.props.disabled ? 'disabled' : undefined}
          onChange={this.props.onChange}
        />
      </ControlGroup>
    )
  }
}

TextareaControl.propTypes = propTypes

export default TextareaControl
