import type { NodeType } from "sirixdb";

export type Path = Array<string | number | null>;

export interface ContainerProps {
  treeNode: any;
  path: Path;
  nodeKey: number;
  childCount: number;
  nodeType: NodeType;
  diff: any;
}

export interface KeyProps {
  key: string;
  treeNode: any;
  path: Path;
  nodeKey: number;
  nodeType: NodeType;
  childs: any;
  diff?: any;
}

export interface ValueProps {
  value: string | number | boolean | null;
  diff: any;
  nodeType: NodeType;
  nodeKey: number;
}

export type Props = ContainerProps | KeyProps | ValueProps;

export const containerFuncReg = (props): ContainerProps => {
  return {
    treeNode: props.child,
    path: props.path,
    nodeKey: props.node.metadata.nodeKey,
    childCount: props.node.metadata.childCount,
    nodeType: props.node.metadata.type,
    diff: props.diff
  }
}

export const keyFuncReg = (props): KeyProps => {
  return {
    key: props.node.key,
    treeNode: props.child,
    path: props.path,
    nodeKey: props.node.metadata.nodeKey,
    nodeType: props.node.metadata.type,
    childs: props.node.value,
  }
}

export const valueFuncReg = (props): ValueProps => {
  return {
    value: props.node.value,
    diff: props.diff,
    nodeType: props.node.metadata.type,
    nodeKey: props.node.metadata.nodeKey
  }
}
