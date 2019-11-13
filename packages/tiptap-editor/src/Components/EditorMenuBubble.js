import React, { Component } from 'react'
import Icon from './Icon'
import { cordsAtPos } from '../Utils'

export default class EditorMenuBubble extends Component {

  constructor(props) {

    super(props)

    this.state = {
      linkUrl: null,
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
      linkUrl: null,
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

  getStyles(){
    const { linkMenuIsActive } = this.state;

    return {
      button: { display: linkMenuIsActive ? 'none' : 'inline-flex' },
      form: { display: linkMenuIsActive ? 'flex' : 'none' }
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isActive && prevProps.isActive) {
      this.setState({ linkUrl: null, linkMenuIsActive: false })
    }
  }

  getClassNames(){
    const isActive = this.editor.isActive
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
    const editor = this.editor
    let { name: key } = e.currentTarget

    if (key === 'h4') editor.commands['heading']({ level: 4 })
    else editor.commands[key]()
  }

  getLinkForm() {
    const styles = this.getStyles()
    const { linkUrl } = this.state

    return (
      <form
        className="menububble__form"
        onSubmit={this.setLinkUrl}
        style={styles.form}
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

  getMenuButtons() {
    const classNames = this.getClassNames()
    const styles = this.getStyles()

    return (
      <>
        <button
          name='bold'
          className={classNames.bold}
          onClick={this.handleMenuButton}
          style={styles.button}
        >
          <Icon name='bold' />
        </button>
        <button
          name='italic'
          className={classNames.italic}
          onClick={this.handleMenuButton}
          style={styles.button}
        >
          <Icon name='italic' />
        </button>
        <button
          name='h4'
          className={classNames.h4}
          onClick={this.handleMenuButton}
          style={styles.button}
        >
          <b>H4</b>
        </button>
        <button
          name='bullet_list'
          className={classNames.bullet_list}
          onClick={this.handleMenuButton}
          style={styles.button}
        >
          <Icon name='list' />
        </button>
        <button
          name='ordered_list'
          className={classNames.ordered_list}
          onClick={this.handleMenuButton}
          style={styles.button}
        >
          <Icon name='list-ol'/>
        </button>

        <button
          className="menububble__button"
          onClick={this.showLinkMenu}
          className={classNames.link}
          style={styles.button}
        >
          <Icon name='link' />
        </button>
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
