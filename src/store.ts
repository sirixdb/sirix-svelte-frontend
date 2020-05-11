import { writable, Writable } from "svelte/store";
import { DatabaseInfo } from "sirix/src/info";


export const dbInfo: Writable<DatabaseInfo[]> = writable([]);

export const loggedIn = writable(false);

function refresher() {
  const { subscribe, set, update } = writable(0);

  return {
    subscribe,
    set,
    refresh: () => {
      update((val) => val + 1);
    }
  };
}

export const refreshHistory = refresher();
export const refreshResource = refresher();

interface resourceInfo {
  dbName: string,
  dbType: string,
  resourceName: string,
  revision: number,
  diff: number
}

export const diffView = writable(false);

export const selected: Writable<resourceInfo> = writable({
  dbName: null,
  dbType: null,
  resourceName: null,
  // there is no revision 0, but using 0 instead of null will signify that we are not using xquery view
  revision: 0,
  diff: null
})