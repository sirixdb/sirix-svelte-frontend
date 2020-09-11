import { tick } from "svelte";

interface Props {
  itemsCount: number;
  maxHeight: number;
  averageHeight: number;
}

export function virtualize(node: HTMLElement, { itemsCount, maxHeight, averageHeight = 24 }: Props) {
  let startIndex = 0;
  let endIndex = 0;
  let topOffset = 0;
  let bottomOffset = 0;
  let heightMap: number[] = Array(itemsCount);
  node.style.maxHeight = `${maxHeight}px`;
  async function handleScroll() {
    const oldStartIndex = startIndex;
    const { scrollTop } = node;
    let rows = Array.from(node.firstElementChild.children) as HTMLElement[];

    rows.forEach((el, index) => {
      heightMap[index + startIndex] = el.offsetHeight;
    });

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
    const slicedLastIndex = sliced.length - 1;
    for (const [index, height] of sliced.entries()) {
      y += height || averageHeight;
      if (y > scrollTop + maxHeight || index === slicedLastIndex) {
        endIndex = index + startIndex;
        break;
      };
    }

    const remaining = itemsCount - endIndex - 1;
    averageHeight = y / (endIndex + 1);
    bottomOffset = remaining * averageHeight;
    bottomOffset = Math.max(0, bottomOffset);

    node.dispatchEvent(new CustomEvent('virtualize', {
      detail: { startIndex, endIndex }
    }));

    //@ts-ignore
    node.firstElementChild.style.paddingTop = `${topOffset}px`;
    //@ts-ignore
    node.firstElementChild.style.paddingBottom = `${bottomOffset}px`;

    // need this block for scrolling up into expanded elements
    if (startIndex < oldStartIndex) {
      await tick();

      let expected_height = 0;
      let actualHeight = 0;

      for (let i = startIndex; i < oldStartIndex; i += 1) {
        if (rows[i - startIndex]) {
          expected_height += heightMap[i];
          actualHeight += rows[i - startIndex].offsetHeight;
        }
      }

      const d = actualHeight - expected_height;
      node.scrollTo(0, scrollTop + d);
    }
  }

  // init
  (async () => {
    await tick();
    handleScroll();
  })();

  node.addEventListener("scroll", handleScroll);
  return {
    destroy: () => {
      node.removeEventListener("scroll", handleScroll);
    },
    update: (props: Props) => {
      maxHeight = props.maxHeight;
      node.style.maxHeight = `${maxHeight}px`;
      itemsCount = props.itemsCount;
      averageHeight = props.averageHeight;
    }
  }
}
