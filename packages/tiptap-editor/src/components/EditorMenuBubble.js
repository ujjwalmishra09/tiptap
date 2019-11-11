import React, { Component } from 'react'
import Icon from './Icon'

export default class EditorMenuBubble extends Component {

  constructor(props) {

    super(props)

    this.state = {
      linkUrl: null,
      linkMenuIsActive: false,
    }

    this.setLinkUrl = this.setLinkUrl.bind(this)
    this.changeValue = this.changeValue.bind(this)
    this.resetLinkUrl = this.resetLinkUrl.bind(this)
    this.hideLinkMenu = this.hideLinkMenu.bind(this)
    this.showLinkMenu = this.showLinkMenu.bind(this)
    this.hideLinkOnEscape = this.hideLinkOnEscape.bind(this)
    this.handleMenuButton = this.handleMenuButton.bind(this)

    this.firstButton = React.createRef()
    this.linkInput = React.createRef()
  }

  showLinkMenu() {
    const attrs = this.props.getEditor().getMarkAttrs('link')
    this.setState({
      linkUrl: attrs.href,
      linkMenuIsActive: true
    }, () => {
      if(this.linkInput) this.linkInput.current.focus()
    })
  }

  hideLinkMenu(){
    this.setState({
      linkUrl: null,
      linkMenuIsActive: false
    })
  }

  hideLinkOnEscape(e) {
    if (e.keyCode === 27) this.hideLinkMenu()
  }

  setLinkUrl() {
    const command = this.props.getEditor().commands.link
    command({ href: this.state.linkUrl })
    this.hideLinkMenu()
  }

  resetLinkUrl() {
    const command = this.props.getEditor().commands.link
    command({ href: null })
    this.hideLinkMenu()
  }

  getStyles(){
    const { left, right } = this.state;

    return {
      parent: { left, right }
    }
  }

  getClassNames(){
    const isActive = this.props.getEditor().isActive
    return {
      bold: `menububble__button ${isActive.bold() ? 'is-active' : ''}`,
      italic: `menububble__button ${isActive.italic() ? 'is-active' : ''}`,
      link: `menububble__button ${isActive.link() ? 'is-active' : ''}`,
      h4: `menububble__button ${isActive.heading({ level: 4 }) ? 'is-active' : ''}`,
      bullet_list: `menububble__button ${isActive.bullet_list() ? 'is-active' : ''}`,
      ordered_list: `menububble__button ${isActive.ordered_list() ? 'is-active' : ''}`,
    }
  }

  changeValue(e) {
    this.setState({ linkUrl: event.target.value })
  }

  handleMenuButton(e) {
    const editor = this.props.getEditor()
    let { name: key } = e.currentTarget

    if (key === 'h4') editor.commands['heading']({ level: 4 })
    else editor.commands[key]()
  }

  render() {
    const editor = this.props.getEditor()
    const styles = this.getStyles()
    const classNames = this.getClassNames()
    const commands = editor.commands
    const { linkMenuIsActive, linkUrl } = this.state;

    if (linkMenuIsActive) {
      return (
        <form className="menububble__form" onSubmit={this.setLinkUrl}>
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
            type="button"
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
    return (
      <>
        <button
          name='bold'
          className={classNames.bold}
          onClick={this.handleMenuButton}
        >
          <Icon name='bold' />
        </button>
        <button
          name='italic'
          className={classNames.italic}
          onClick={this.handleMenuButton}
        >
          <Icon name='italic' />
        </button>
        <button
          name='h4'
          className={classNames.h4}
          onClick={this.handleMenuButton}
        >
          <b>H4</b>
        </button>
        <button
          name='bullet_list'
          className={classNames.bullet_list}
          onClick={this.handleMenuButton}
        >
          <Icon name='list' />
        </button>
        <button
          name='ordered_list'
          className={classNames.ordered_list}
          onClick={this.handleMenuButton}
        >
          <Icon name='list-ol'/>
        </button>

        <button
          className="menububble__button"
          onClick={this.showLinkMenu}
          className={classNames.link}
        >
          <Icon name='link' />
        </button>
      </>
    )
  }
}
