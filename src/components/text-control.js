import ClassNames from 'classnames'
import ControlGroup from './control-group'
import PropTypes from 'prop-types'
import React, { useImperativeHandle, useRef } from 'react'

// 使用 forwardRef 讓父元件可透過 ref 呼叫 focus() 與 value()
const TextControl = React.forwardRef(({
  autoCapitalize = 'off',
  disabled,
  hasError,
  help,
  inputClasses,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  ...rest
}, ref) => {
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    value: () => inputRef.current?.value
  }))

  const className = ClassNames({ 'form-control': true, 'is-invalid': hasError, ...inputClasses })

  return (
    <ControlGroup hasError={hasError} label={label} help={help}>
      <input
        ref={inputRef}
        type={type}
        autoCapitalize={autoCapitalize}
        className={className}
        name={name}
        placeholder={placeholder}
        disabled={disabled || undefined}
        onChange={onChange}
        {...rest}
      />
    </ControlGroup>
  )
})

TextControl.displayName = 'TextControl'

TextControl.propTypes = {
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default TextControl
