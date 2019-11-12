function textRange(node, from, to) {
  const range = document.createRange()
  range.setEnd(node, to == null ? node.nodeValue.length : to)
  range.setStart(node, from || 0)
  return range
}

function singleRect(object, bias) {
  const rects = object.getClientRects()
  return !rects.length ? object.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1]
}

export function coordsAtPos(view, pos, end = false) {
  const { node, offset } = view.docView.domFromPos(pos)
  let side
  let rect
  if (node.nodeType === 3) {
    if (end && offset < node.nodeValue.length) {
      rect = singleRect(textRange(node, offset - 1, offset), -1)
      side = 'right'
    } else if (offset < node.nodeValue.length) {
      rect = singleRect(textRange(node, offset, offset + 1), -1)
      side = 'left'
    }
  } else if (node.firstChild) {
    if (offset < node.childNodes.length) {
      const child = node.childNodes[offset]
      rect = singleRect(child.nodeType === 3 ? textRange(child) : child, -1)
      side = 'left'
    }
    if ((!rect || rect.top === rect.bottom) && offset) {
      const child = node.childNodes[offset - 1]
      rect = singleRect(child.nodeType === 3 ? textRange(child) : child, 1)
      side = 'right'
    }
  } else {
    rect = node.getBoundingClientRect()
    side = 'left'
  }

  const x = rect[side]

  return {
    top: rect.top,
    bottom: rect.bottom,
    left: x,
    right: x,
  }
}
