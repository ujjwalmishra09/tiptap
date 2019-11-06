import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Icon extends Component {
  render() {
    const { name, size, fixAlign} = this.props
    return (
      <div className={`icon icon--${name} icon--${size} ${fixAlign ? 'has-align-fix' : ''}`}>
        <i className={`fa fa-${name}`}></i>
      </div>
    )
  }
}

Icon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  fixAlign: PropTypes.bool
}

Icon.defaultProps = {
  name: '',
  size: 'normal',
  fixAlign: true
}

export default Icon
