# @qc/attach-node

Allows easy attachment of a `Node` or an `Element` instance to another `Node` instance or an `Element` instance.


## Syntax

```typescript
type CssSelector = string;

type NodeLike = CssSelector | Node;

type AttachAction = 'after' | 'before' | 'endof' | 'startof';

type AttachableString = AttachAction + '@' + CssSelector;

interface AttachableObject {
  [AttachAction]: NodeLike;
}

type Attachable = AttachableString | AttachableObject;

declare function attachNode (node: Node, attachable: Attachable | Attachable[]): void;
```


## Examples

```js
import attachNode from 'attach-node'

const someNode = ... // Get a reference to some node somehow.

// Using {action}@{css-selector} Syntax:
attachNode(someNode, 'startof@body')
attachNode(someNode, 'endof@body')
attachNode(someNode, 'before@.app')
attachNode(someNode, 'after@.app')

// Using Object Syntax with CSS Selector:
attachNode(someNode, { startof: 'body' })
attachNode(someNode, { endof: 'body' })
attachNode(someNode, { before: '.app' })
attachNode(someNode, { after: '.app' })

const otherNode = ... // Get a reference to some other node.

// Using Object Syntax with Node Instance:
attachNode(someNode, { startof: otherNode })
attachNode(someNode, { endof: otherNode })
attachNode(someNode, { before: otherNode })
attachNode(someNode, { after: otherNode })

// With Fallbacks:
// The first "attachable" that matches to an existing Node instance wins.
attachNode(someNode, [
  'before@.foo > .bar',
  { startof: otherNode },
  'endof@body',
])
```
