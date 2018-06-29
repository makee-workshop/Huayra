import React, { Component } from 'react'

class Alert extends Component {
  render() {
    let close

    if (this.props.onClose) {
      close = <button
        type="button"
        className="close"
        onClick={this.props.onClose}>
        &times;
      </button>
    }

    return (
      <div className={`alert alert-${this.props.type}`}>
        {close}
        {this.props.message}
      </div>
    )
  }
}

export default Alert