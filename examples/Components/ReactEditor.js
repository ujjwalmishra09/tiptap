import React, { Component } from 'react'
import {
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Heading,
  Placeholder
} from 'tiptap-extensions'
import { Editor } from 'tiptap'

import EditorMenuBubble from './EditorMenuBubble'

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
    this.editor = new Editor({
      extensions: [
        new Heading({ levels: [4] }),
        new ListItem(),
        new OrderedList(),
        new BulletList(),
        new Link({ openOnClick: false }),
        new Bold({ tag: 'b' }),
        new Italic(),
        new Placeholder({
          emptyNodeClass: 'is-empty',
          emptyNodeText: 'Write something …',
          showOnlyWhenEditable: true,
        })
      ],
      element: this.contentRef.current,
      menuBubble: {
        element: this.menuBubbleRef.current,
        keepInBounds: true,
        onUpdate: menu => this.setState({menu})
      }
    })
    this.setState({ isEditorRedy: true })
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
      menububble: `menububble${menu.isActive ? ' is-active' : ''}`
    }
  }

  render() {
    const styles = this.getStyles()
    const classNames = this.getClassNames()
    const { isEditorRedy } = this.state

    return (
      <>
        <div
          ref={this.menuBubbleRef}
          className={classNames.menububble}
          style={styles.menububble}
        >
          {isEditorRedy && <EditorMenuBubble getEditor={()=>this.editor}/>}
        </div>
        <div ref={this.contentRef} className="editor__content"></div>
      </>
    )
  }
}
