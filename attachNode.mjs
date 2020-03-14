/* eslint-env browser */

function attachNode (node, attachables) {
  if (!node) { return }
  if (!attachables) { return }

  if (!Array.isArray(attachables)) {
    attachables = [attachables]
  }

  let attached = false
  for (let i = 0, iLen = attachables.length; i < iLen; ++i) {
    const attachable = attachables[i]

    const attachableObj = _toAttachableObj(attachable)

    if (attachableObj) {
      const entries = Object.entries(attachableObj)

      for (let j = entries.length - 1; j >= 0; --j) {
        const [action, nodeLikes] = entries[j]
        const existingNode = _resolveNodeLikes(nodeLikes)
        if (existingNode) {
          if (action === 'after') {
            if (existingNode.parentNode) {
              existingNode.parentNode.insertBefore(node, existingNode.nextSibling)
              attached = true
              break
            }
          }
          else if (action === 'endof') {
            existingNode.appendChild(node)
            attached = true
            break
          }
          else if (action === 'before') {
            if (existingNode.parentNode) {
              existingNode.parentNode.insertBefore(node, existingNode)
              attached = true
              break
            }
          }
          else if (action === 'startof') {
            // existingNode.prepend(node) // Not in IE according to MDN
            // existingNode.prependChild(node) // Does not exist

            if (existingNode.firstChild) {
              existingNode.insertBefore(node, existingNode.firstChild)
            }
            else {
              existingNode.appendChild(node)
            }

            attached = true
            break
          }
        }
      }
    }

    if (attached) {
      break
    }
  }
}

function _resolveNodeLikes (nodeLikes) {
  let node

  for (let i = 0, iLen = nodeLikes.length; i < iLen; ++i) {
    const nodeLike = nodeLikes[i]

    if (typeof nodeLike === 'string') {
      node = document.querySelector(nodeLike)
    }
    else if (nodeLike instanceof Node) {
      node = nodeLike
    }
    else if (typeof nodeLike === 'function') {
      node = nodeLike()
    }

    if (node instanceof Node) {
      return node
    }
  }

  return node || null
}

const ATTACH_INFO = ['after', 'before', 'endof', 'startof'].map(
  a => ({ a, p: a + '@', re: new RegExp(`^${a}@`) })
)

function _toAttachableObj (attachable) {
  let attachableObj = attachable
  const typeOfAttachable = typeof attachable

  if (typeOfAttachable === 'string') {
    for (let i = 0, iLen = ATTACH_INFO.length; i < iLen; ++i) {
      const { a, p, re } = ATTACH_INFO[i]
      if (attachable.startsWith(p)) {
        const selector = attachable.replace(re, '').trim()
        if (selector) {
          attachableObj = { [a]: selector }
          break
        }
      }
    }
  }
  else if (typeOfAttachable === 'function') {
    attachableObj = _toAttachableObj(attachable())
  }

  if (attachableObj && typeof attachableObj === 'object') {
    const attachableObjEntries = Object.entries(attachableObj)
    attachableObj = {}
    for (let i = 0, iLen = attachableObjEntries.length; i < iLen; ++i) {
      const [action, node] = attachableObjEntries[i]

      const nodeLike = _toNodeLikes(node)

      if (nodeLike) {
        attachableObj[action] = nodeLike
      }
    }
  }
  else {
    attachableObj = null
  }

  return attachableObj
}

function _toNodeLikes (node) {
  let nodeLikes = node

  if (!Array.isArray(node)) {
    nodeLikes = [nodeLikes]
  }

  nodeLikes = nodeLikes.map(_toNodeLike)

  return nodeLikes
}

function _toNodeLike (node) {
  let nodeLike

  const typeOfNode = typeof node

  if (typeOfNode === 'string') {
    nodeLike = node
  }
  else if (typeOfNode === 'function') {
    nodeLike = _toNodeLike(node())
  }

  return nodeLike
}

export default attachNode
