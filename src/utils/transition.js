// transitions
import { sineInOut } from "svelte/easing";

// svelte's built-in fade funciton, extended
export function expandAndFade(node, { delay = 0, duration = 300 }) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    css: t => {
      const eased = sineInOut(t);
      const h = Number.parseFloat(getComputedStyle(node).height.slice(0, -2));

      return `
        max-height: ${eased * h}px;
        opacity: ${t * o};`;
    }
  };
}
