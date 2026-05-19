import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

const Alert = ({
  type = 'info',
  message = '',
  onClose
}) => {
  const dismissibleClass = onClose ? ' alert-dismissible' : ''

  return (
    <div className={`alert alert-${type}${dismissibleClass}`} role='alert'>
      {onClose && (
        <button
          type='button'
          className='btn-close'
          aria-label='Close'
          onClick={onClose}
        />
      )}
      {message}
    </div>
  )
}

Alert.propTypes = propTypes

export default Alert
