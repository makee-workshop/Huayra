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
  onClose = () => {}
}) => {
  return (
    <div className={`alert alert-${type}`}>
      {onClose && (
        <button
          type='button'
          className='close'
          onClick={onClose}
        >
          &times;
        </button>
      )}
      {message}
    </div>
  )
}

Alert.propTypes = propTypes

export default Alert
