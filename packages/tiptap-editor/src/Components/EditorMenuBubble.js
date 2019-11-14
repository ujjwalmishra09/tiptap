import React, { Component } from 'react'
import Icon from './Icon'
import { cordsAtPos } from '../Utils'

export default class EditorMenuBubble extends Component {

  constructor(props) {

    super(props)

    this.state = {
      linkUrl: '',
      linkMenuIsActive: false,
    }

    this.editor = props.getEditor()

    this.setLinkUrl = this.setLinkUrl.bind(this)
    this.changeValue = this.changeValue.bind(this)
    this.resetLinkUrl = this.resetLinkUrl.bind(this)
    this.hideLinkMenu = this.hideLinkMenu.bind(this)
    this.showLinkMenu = this.showLinkMenu.bind(this)
    this.hideLinkOnEscape = this.hideLinkOnEscape.bind(this)
    this.handleMenuButton = this.handleMenuButton.bind(this)
    this.getButton = this.getButton.bind(this)

    this.firstButton = React.createRef()
    this.linkInput = React.createRef()
  }

  showLinkMenu() {
    const command = this.editor.commands.link
    const attrs = this.editor.getMarkAttrs('link')
    this.setState({
      linkUrl: attrs.href,
      linkMenuIsActive: true
    }, () => {
      if (this.linkInput) this.linkInput.current.focus()
      command({ href: attrs.href })
    })
  }

  hideLinkMenu(cb = () => {}){
    this.setState({
      linkUrl: '',
      linkMenuIsActive: false
    }, cb)
  }

  hideLinkOnEscape(e) {
    if (e.keyCode === 27) this.hideLinkMenu()
  }

  setLinkUrl() {
    const command = this.editor.commands.link
    const href = this.state.linkUrl

    this.hideLinkMenu(() => command({ href }))
  }

  resetLinkUrl() {
    const attrs = this.editor.getMarkAttrs('link')
    const command = this.editor.commands.link

    this.hideLinkMenu(() => command({ href: attrs.href }))
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isActive && prevProps.isActive) {
      this.setState({ linkUrl: '', linkMenuIsActive: false })
    }
  }

  getClassName(button){
    let isActive = false

    if (button === 'h4' || button === 'h2') {
      isActive = this.editor.isActive['heading']({
        level: Number(button.split('')[1])
      })
    } else {
      isActive = this.editor.isActive[button]()
    }

    return `menububble__button ${ isActive ? 'is-active' : ''}`
  }

  changeValue(e) {
    this.setState({ linkUrl: event.target.value })
  }

  handleMenuButton(e) {
    const editor = this.editor
    let { name: key } = e.currentTarget

    if (key === 'h4') editor.commands['heading']({ level: 4 })
    else if (key === 'h2') editor.commands['heading']({ level: 2 })
    else if (key == 'link') this.showLinkMenu(e)
    else editor.commands[key]()
  }

  getLinkForm() {
    const { linkUrl, linkMenuIsActive } = this.state

    return (
      <form
        className="menububble__form"
        style={{ display: linkMenuIsActive ? 'flex' : 'none' }}
      >
        <input
          className="menububble__input"
          type="text"
          value={linkUrl}
          onChange={this.changeValue}
          placeholder="https://"
          ref={this.linkInput}
          onKeyDown={this.hideLinkOnEscape}
        />
        <button
          className="menububble__button"
          onClick={this.setLinkUrl}
          type='button'
        >
           <Icon name='check' />
        </button>
        <button
          className="menububble__button"
          onClick={this.resetLinkUrl}
          type="button"
        >
           <Icon name='times-circle' />
        </button>
      </form>
    )
  }

  getIconName(button) {
    if (button === 'bullet_list') return 'list'
    else if (button === 'ordered_list') return 'list-ol'
    return button
  }

  getButton(button) {
    const { linkMenuIsActive } = this.state

    return (
      <button
        name={button}
        className={this.getClassName(button)}
        onClick={this.handleMenuButton}
        style={{ display: linkMenuIsActive ? 'none' : 'inline-flex' }}
        key={button}
      >
        <Icon name={this.getIconName(button)} />
      </button>
    )
  }

  getMenuButtons() {
    return (
      <>
        {this.props.buttons.map(this.getButton)}
      </>
    )
  }

  render() {
    return (
      <>
        {this.getMenuButtons()}
        {this.getLinkForm()}
      </>
    )
  }
}
