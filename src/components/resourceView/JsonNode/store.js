import { writable } from "svelte/store";
export function refresher() {
    const { subscribe, set, update } = writable(0);
    return {
        subscribe,
        set,
        refresh: () => {
            update((val) => val + 1);
        }
    };
}
export const refreshDisplay = refresher();
//# sourceMappingURL=store.js.map