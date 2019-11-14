import React, { Component } from 'react'

class Icon extends Component {
  render() {
    const { name, size, fixAlign} = this.props
    if (name === 'h2') return <b>H2</b>
    if (name === 'h4') return <b>H4</b>
    return (
      <div className={`icon icon--${name} icon--${size} ${fixAlign ? 'has-align-fix' : ''}`}>
        <i className={`fa fa-${name}`}></i>
      </div>
    )
  }
}

Icon.defaultProps = {
  name: '',
  size: 'normal',
  fixAlign: true
}

export default Icon
