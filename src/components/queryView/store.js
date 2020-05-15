import { writable } from "svelte/store";

export const dataStore = writable([]);

export const subTreeStore = writable(undefined);

export const queryStore = writable("");
