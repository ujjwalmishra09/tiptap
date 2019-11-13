import React, { Component } from 'react'
import {
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Heading,
  Placeholder,
  History
} from 'tiptap-extensions'
import { Editor as TiptapEditor } from 'tiptap'

import MenuBubblePlugin from '../Plugins/MenuBubble'
import EditorMenuBubble from './EditorMenuBubble'

class Editor extends TiptapEditor {
  constructor(options = {}) {
    super(options)
    this.setMenuBubble()
  }

  setMenuBubble() {
    const { menuBubble } = this.options

    if (menuBubble && menuBubble.element) {
      this.registerPlugin(MenuBubblePlugin({
        editor: this,
        ...this.options.menuBubble
      }))
    }
  }

  destroy() {
    if (!this.view) {
      return
    }
    if (menuBubble && menuBubble.element) this.unregisterPlugin('menu_bubble')
    this.view.destroy()
  }

}

export default class ReactEditor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      menu: {
        isActive: false,
        left: 0,
        bottom: 0,
      },
      isEditorRedy: false
    }
    this.menuBubbleRef = React.createRef()
    this.contentRef = React.createRef()
  }

  componentDidMount() {
    const { onUpdate, placeholder, content } = this.props

    this.editor = new Editor({
      extensions: [
        new Heading({ levels: [4] }),
        new ListItem(),
        new OrderedList(),
        new BulletList(),
        new Link({ openOnClick: false }),
        new Bold({ tag: 'b' }),
        new Italic({ tag: 'i' }),
        new Placeholder({
          emptyNodeClass: 'is-empty',
          emptyNodeText: placeholder || 'Write something …',
          showOnlyWhenEditable: true,
        }),
        new History()
      ],
      content: content || '',
      element: this.contentRef.current,
      menuBubble: {
        element: this.menuBubbleRef.current,
        keepInBounds: true,
        onUpdate: menu => this.setState({menu})
      },
      onUpdate: (data) => {
        if (onUpdate) onUpdate(data)
      }
    })
    this.setState({ isEditorRedy: true })
  }

  componentWillUnmount() {
    this.editor.destroy()
  }

  getStyles() {
    const { menu } = this.state

    return {
      menububble: {left: menu.left, bottom: menu.bottom }
    }
  }

  getClassNames() {
    const { menu } = this.state

    return {
      menububble: `menububble${ menu.isActive ? ' is-active' : '' }`
    }
  }

  render() {
    const styles = this.getStyles()
    const classNames = this.getClassNames()
    const { isEditorRedy, menu: { isActive } } = this.state

    return (
      <div className="tiptap__editor">
        <div
          ref={this.menuBubbleRef}
          className={classNames.menububble}
          style={styles.menububble}
        >
          {
            isEditorRedy &&
            <EditorMenuBubble
              isActive={isActive}
              getEditor={()=>this.editor}
            />
          }
        </div>
        <div ref={this.contentRef} className="tiptap__editor__content"></div>
      </div>
    )
  }
}
