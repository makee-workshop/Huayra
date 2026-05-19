import ClassNames from 'classnames'
import ControlGroup from './control-group'
import PropTypes from 'prop-types'
import React, { useImperativeHandle, useRef } from 'react'

// 使用 forwardRef 讓父元件可透過 ref 呼叫 focus() 與 value()
const TextareaControl = React.forwardRef(({
  disabled,
  hasError,
  help,
  inputClasses,
  label,
  name,
  onChange,
  placeholder,
  rows,
  value
}, ref) => {
  const textareaRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    value: () => textareaRef.current?.value
  }))

  const className = ClassNames({ 'form-control': true, 'is-invalid': hasError, ...inputClasses })

  return (
    <ControlGroup hasError={hasError} label={label} help={help}>
      <textarea
        ref={textareaRef}
        className={className}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        disabled={disabled || undefined}
        onChange={onChange}
      />
    </ControlGroup>
  )
})

TextareaControl.displayName = 'TextareaControl'

TextareaControl.propTypes = {
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  help: PropTypes.string,
  inputClasses: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default TextareaControl
