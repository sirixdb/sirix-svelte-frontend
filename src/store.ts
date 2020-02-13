import { writable, Writable } from "svelte/store";
import { DatabaseInfo } from "sirix/src/info";

function JSONResource(init: object) {
  const { subscribe, set, update } = writable(init);

  return {
    subscribe,
    set,
    inject: (path: Array<number | string>, key: number | string, insertNode: object) => {
      update(
        (obj: object) => {
          const node = path.reduce((oldNode: object, key: number | string) => {
            return oldNode[key]
          }, obj)
          node[key] = insertNode;
          return obj
        }
      )
    },
  };
}

export const jsonResource = JSONResource(null);

export const dbInfo: Writable<DatabaseInfo[]> = writable([]);

export const loggedIn = writable(false);

interface resourceInfo {
  dbName: string,
  dbType: string,
  resourceName: string
}

export const selected: Writable<resourceInfo> = writable({
  dbName: null,
  dbType: null,
  resourceName: null
})