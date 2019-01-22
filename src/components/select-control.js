import ClassNames from 'classnames'
import ControlGroup from './control-group'
import ObjectAssign from 'object-assign'
import PropTypes from 'prop-types'
import React from 'react'

const propTypes = {
    autoCapitalize: PropTypes.string,
    disabled: PropTypes.bool,
    hasError: PropTypes.bool,
    help: PropTypes.string,
    inputClasses: PropTypes.object,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}
const defaultProps = {
    autoCapitalize: 'off'
}

class SelectControl extends React.Component {
    focus() {
        return this.input.focus();
    }

    value() {
        return this.input.value;
    }

    render() {
        const inputClasses = ClassNames(ObjectAssign({
            'form-control': true
        }, this.props.inputClasses));

        return (
            <ControlGroup
                hasError={this.props.hasError}
                label={this.props.label}
                help={this.props.help}>

                <select
                    ref={(c) => (this.input = c)}
                    autoCapitalize={this.props.autoCapitalize}
                    className={inputClasses}
                    name={this.props.name}
                    value={this.props.value}
                    disabled={this.props.disabled ? 'disabled' : undefined}
                    onChange={this.props.onChange}
                >
                    <option value="">請選擇</option>
                    {this.props.children}
                </select>
            </ControlGroup>
        )
    }
}

SelectControl.propTypes = propTypes;
SelectControl.defaultProps = defaultProps;

export default SelectControl
