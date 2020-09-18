import { tick } from "svelte";
import type { JSONResource } from "./tree";
import { refreshDisplay } from "./store.js"

interface Props {
  jsonResource: JSONResource;
  maxHeight: number;
  averageHeight?: number;
}

export function virtualize(node: HTMLElement, { jsonResource, maxHeight, averageHeight = 24 }: Props) {
  let startIndex = 0;
  let endIndex = 0;
  let topOffset = 0;
  let bottomOffset = 0;
  async function handleScroll(event: Event) {
    const { scrollTop } = node;
    const itemsCount = jsonResource.totalExpanded();
    let heightMap: number[] = Array(jsonResource.totalExpanded()).fill(averageHeight);

    let y = 0;

    for (let [index, height] of heightMap.entries()) {
      const rowHeight = height || averageHeight;
      if (y + rowHeight > scrollTop) {
        // visible or partially visible
        if (index > itemsCount) {
          // if we somehow scrolled too far
          index = itemsCount;
        }
        startIndex = index;
        topOffset = y;
        break;
      }
      y += rowHeight;
    }

    const sliced = heightMap.slice(startIndex);
    const slicedLastIndex = heightMap.length;
    for (const [index, height] of sliced.entries()) {
      y += height || averageHeight;
      endIndex = index + startIndex;
      if (y > scrollTop + maxHeight || endIndex === slicedLastIndex) {
        break;
      };
    }

    let remaining = itemsCount - endIndex - 1;
    averageHeight = y / (endIndex + 1);
    bottomOffset = remaining * averageHeight;
    bottomOffset = Math.max(0, bottomOffset);

    node.dispatchEvent(new CustomEvent('virtualize', {
      detail: { startIndex, endIndex, bottomOffset, topOffset }
    }));

    event && event.stopPropagation();
    event && event.preventDefault();
  }

  let unsubscribe;
  // init
  (async () => {
    await tick();
    unsubscribe = refreshDisplay.subscribe(() => handleScroll(undefined));
    handleScroll(undefined);
  })();

  node.addEventListener("scroll", handleScroll);
  node.addEventListener("revirtualize", handleScroll);
  return {
    destroy: () => {
      node.removeEventListener("scroll", handleScroll);
      node.removeEventListener("revirtualize", handleScroll);
      unsubscribe();
    },
    update: (props: Props) => {
      jsonResource = props.jsonResource;
      maxHeight = props.maxHeight;
      if (props.averageHeight) {
        averageHeight = props.averageHeight;
      }
    }
  }
}
