import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const Button = ({
  children,
  disabled,
  inputClasses,
  name,
  onClick,
  type = 'button',
  value
}) => {
  const className = ClassNames({ btn: true, ...inputClasses })

  return (
    <button
      type={type}
      className={className}
      name={name}
      value={value}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  inputClasses: PropTypes.object,
  name: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default Button
