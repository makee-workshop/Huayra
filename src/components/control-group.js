import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const ControlGroup = ({
  children,
  groupClasses,
  hasError,
  help,
  helpClasses,
  hideHelp,
  hideLabel,
  label,
  labelClasses
}) => {
  const groupClassName = ClassNames({ 'form-group': true, 'mb-3': true, 'has-error': hasError, ...groupClasses })
  const labelClassName = ClassNames({ 'control-label': true, 'form-label': true, ...labelClasses })
  const helpClassName = ClassNames({
    'help-block': true,
    'form-text': !hasError,
    'invalid-feedback': hasError,
    'd-block': hasError,
    ...helpClasses
  })

  return (
    <div className={groupClassName}>
      {!hideLabel && <label className={labelClassName}>{label}</label>}
      {children}
      {!hideHelp && <span className={helpClassName}>{help}</span>}
    </div>
  )
}

ControlGroup.propTypes = {
  children: PropTypes.node,
  groupClasses: PropTypes.object,
  hasError: PropTypes.bool,
  help: PropTypes.string,
  helpClasses: PropTypes.object,
  hideHelp: PropTypes.bool,
  hideLabel: PropTypes.bool,
  label: PropTypes.string,
  labelClasses: PropTypes.object
}

export default ControlGroup
