<script context="module" lang="ts">
  import { NodeType } from "sirixdb";
  import Container from "./Container.svelte";
  import Key from "./Key.svelte";
  import Value from "./Value.svelte";

  const getNodeType = (type: NodeType) => {
    switch (type) {
      case NodeType.ARRAY:
      case NodeType.OBJECT:
        return Container;
      case NodeType.BOOLEAN_VALUE:
      case NodeType.OBJECT_BOOLEAN_VALUE:
      case NodeType.NULL_VALUE:
      case NodeType.OBJECT_NULL_VALUE:
      case NodeType.NUMBER_VALUE:
      case NodeType.OBJECT_NUMBER_VALUE:
      case NodeType.STRING_VALUE:
      case NodeType.OBJECT_STRING_VALUE:
        return Value
      case NodeType.OBJECT_KEY:
        return Key;
    }
  };
</script>

<script lang="ts">
  import type { JSONResource, ExtendedMetaNode } from "./tree";

  export let jsonResource: JSONResource;
  export let path: (string | number | null)[];

  let component: typeof Container | typeof Key | typeof Value;

  let currentNode: ExtendedMetaNode;
  $: {
    currentNode = jsonResource.get(path);
    component = getNodeType(currentNode.metadata.type);
  }
</script>

<slot {component} {path} node={currentNode} />
