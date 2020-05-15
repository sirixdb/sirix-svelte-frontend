import { writable } from "svelte/store";

/*  // type of `dbInfo` is Writable<DatabaseInfo[]>
 *  interface DatabaseInfo {
 *   name: string
 *   type: string
 *   resources: string[]
 *  }
 */
export const dbInfo = writable([]);

export const loggedIn = writable(false);

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

export const refreshHistory = refresher();
export const refreshResource = refresher();

/*
 *  // type of `selected` is Writable<resourceInfo>
 *  interface resourceInfo {
 *    dbName: string,
 *    dbType: string,
 *    resourceName: string,
 *    revision: number,
 *    diff: number
 *  }
*/
export const diffView = writable(false);

export const selected = writable({
  dbName: null,
  dbType: null,
  resourceName: null,
  // there is no revision 0, but using 0 instead of null will signify that we are not using xquery view
  revision: 0,
  diff: null
})