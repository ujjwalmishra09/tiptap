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
    const { menuBubble } = this.options

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

  getExtensions() {
    const buttons = this.props.buttons || []

    return buttons.map((button) => {
      switch (button) {
        case 'h4':
          return new Heading({ levels: [4] })
        case 'h2':
          return new Heading({ levels: [2] })
        case 'ordered_list':
          return new OrderedList()
        case 'bullet_list':
          return new BulletList()
        case 'link':
          return new Link({ openOnClick: false })
        case 'bold':
          return new Bold({ tag: 'b' })
        case 'italic':
          return new Italic({ tag: 'i' })
      }
    })
  }

  componentDidMount() {
    const { onUpdate, placeholder, content } = this.props

    this.editor = new Editor({
      extensions: [
        ...this.getExtensions(),
        new ListItem(),
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
    const { buttons } = this.props

    return {
      menububble: `menububble${ buttons && menu.isActive ? ' is-active' : '' }`
    }
  }

  render() {
    const styles = this.getStyles()
    const classNames = this.getClassNames()
    const { isEditorRedy, menu: { isActive } } = this.state
    const { buttons } = this.props

    return (
      <div className="tiptap__editor">
        <div
          ref={this.menuBubbleRef}
          className={classNames.menububble}
          style={styles.menububble}
        >
          {
            isEditorRedy && buttons && buttons.length
            &&
            <EditorMenuBubble
              isActive={isActive}
              getEditor={()=>this.editor}
              buttons={buttons}
            />
          }
        </div>
        <div ref={this.contentRef} className="tiptap__editor__content"></div>
      </div>
    )
  }
}
