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
  let heightMap: number[] = Array(itemsCount).fill(averageHeight);
  node.style.maxHeight = `${maxHeight}px`;
  async function handleScroll(event: Event) {
    const oldStartIndex = startIndex;
    const oldEndIndex = endIndex;
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

      let expectedHeight = 0;
      let actualHeight = 0;

      for (let i = startIndex; i < oldStartIndex; i += 1) {
        if (rows[i - startIndex]) {
          expectedHeight += heightMap[i];
          actualHeight += rows[i - startIndex].offsetHeight;
        }
      }

      const d = actualHeight - expectedHeight;
      node.scrollTo(0, scrollTop + d);
    }

    // need this block for scrolling up when scrolling down into expanded elements
    if (endIndex > oldEndIndex) {
      await tick();

      let expectedHeight = 0;
      let actualHeight = 0;

      for (let i = endIndex; i > oldEndIndex; i -= 1) {
        if (rows[i - startIndex]) {
          expectedHeight += heightMap[i];
          actualHeight += rows[i - startIndex].offsetHeight;
        }
      }

      const d = actualHeight - expectedHeight;
      node.scrollTo(0, scrollTop + d);
    }
    event && event.stopPropagation();
    event && event.preventDefault();
  }

  // init
  (async () => {
    await tick();
    handleScroll(undefined);
  })();

  node.addEventListener("scroll", handleScroll);
  node.addEventListener("revirtualize", handleScroll);
  return {
    destroy: () => {
      node.removeEventListener("scroll", handleScroll);
      node.removeEventListener("revirtualize", handleScroll);
    }
  }
}
