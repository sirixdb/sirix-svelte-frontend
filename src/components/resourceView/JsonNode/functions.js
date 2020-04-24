export const containerFuncReg = (props) => {
  return {
    treeNode: props.child,
    path: props.path,
    nodeKey: props.node.metadata.nodeKey,
    childCount: props.node.metadata.childCount,
    nodeType: props.node.metadata.type
  }
}

export const keyFuncReg = (props) => {
  return {
    key: props.node.key,
    treeNode: props.child,
    path: props.path,
    nodeKey: props.node.metadata.nodeKey,
    nodeType: props.node.metadata.type,
    childs: props.node.value,
  }
}

export const valueFuncReg = (props) => {
  return {
    value: props.node.value,
    diff: props.diff,
    nodeType: props.node.metadata.type,
    nodeKey: props.node.metadata.nodeKey
  }
}