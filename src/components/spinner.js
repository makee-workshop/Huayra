import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Spinner } from 'reactstrap'

const SpinnerComponent = ({ show, space }) => {
  // \u4F9D space prop \u5728\u5DE6\u5074\u6216\u53F3\u5074\u63D2\u5165\u534A\u5F62\u7A7A\u767D
  const spaceLeft = space === 'left' ? '\u00A0\u00A0' : null
  const spaceRight = space === 'right' ? '\u00A0\u00A0' : null
  const className = ClassNames({ hidden: !show })

  return (
    <span className={className}>
      {spaceLeft}
      <Spinner size='sm' color='light' />
      {spaceRight}
    </span>
  )
}

SpinnerComponent.propTypes = {
  show: PropTypes.bool,
  space: PropTypes.string
}

export default SpinnerComponent
