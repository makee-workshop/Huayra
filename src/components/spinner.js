import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Spinner } from 'reactstrap'

const propTypes = {
  show: PropTypes.bool,
  space: PropTypes.string
}

class SpinnerComponent extends React.Component {
  render () {
    let spaceLeft

    if (this.props.space === 'left') {
      spaceLeft = '\u00A0\u00A0'
    }

    let spaceRight

    if (this.props.space === 'right') {
      spaceRight = '\u00A0\u00A0'
    }

    const spinnerClasses = ClassNames({
      hidden: !this.props.show
    })

    return (
      <span className={spinnerClasses}>
        {spaceLeft}
        <Spinner size='sm' color='light' />
        {spaceRight}
      </span>
    )
  }
}

SpinnerComponent.propTypes = propTypes

export default SpinnerComponent
