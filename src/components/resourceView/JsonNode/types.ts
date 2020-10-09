import type DiffContainer from "./DiffNode/Container.svelte";
import type DiffKey from "./DiffNode/Key.svelte";
import type DiffValue from "./DiffNode/Value.svelte";

export type DiffComponentObj =
  | {
    component: typeof DiffContainer;
    type: string;
    data: any;
    nodekey: number;
  }
  | {
    component: typeof DiffValue;
    type: string;
    data: string;
    nodekey: number;
  }
  | {
    component: typeof DiffKey;
    type: string;
    data: string | number | boolean;
    nodekey: number;
  };