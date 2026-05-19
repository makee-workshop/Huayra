import ClassNames from 'classnames'
import ControlGroup from './control-group'
import PropTypes from 'prop-types'
import React, { useImperativeHandle, useRef } from 'react'

// 使用 forwardRef 讓父元件可透過 ref 呼叫 focus() 與 value()
const SelectControl = React.forwardRef(({
  autoCapitalize = 'off',
  children,
  disabled,
  hasError,
  help,
  inputClasses,
  label,
  name,
  onChange,
  value
}, ref) => {
  const selectRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => selectRef.current?.focus(),
    value: () => selectRef.current?.value
  }))

  const className = ClassNames({ 'form-select': true, 'is-invalid': hasError, ...inputClasses })

  return (
    <ControlGroup hasError={hasError} label={label} help={help}>
      <select
        ref={selectRef}
        autoCapitalize={autoCapitalize}
        className={className}
        name={name}
        value={value}
        disabled={disabled || undefined}
        onChange={onChange}
      >
        <option value=''>請選擇</option>
        {children}
      </select>
    </ControlGroup>
  )
})

SelectControl.displayName = 'SelectControl'

SelectControl.propTypes = {
  autoCapitalize: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  help: PropTypes.string,
  inputClasses: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
}

export default SelectControl
