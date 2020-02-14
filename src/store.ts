import { writable, Writable } from "svelte/store";
import { DatabaseInfo, MetaNode } from "sirix/src/info";

function JSONResource(init: MetaNode) {
  const { subscribe, set, update } = writable(init);

  return {
    subscribe,
    set,
    inject: (path: Array<number | string>, insertKey: number | string, insertNode: MetaNode) => {
      update(
        (metaNode: MetaNode) => {
          // path is an array of strings and/or numbers,
          // which make up the sequence of keys to reach the intended node.
          // we can use reduce to iterate through the path, and filter
          // the MetaNode object
          const node = path.reduce((oldNode: MetaNode, key: number | string) => {
            if (key === null) {
              // return root if key is null
              return oldNode;
            } else {
              // we are going to assume that if a key is specified,
              // then we are dealing with an an object or array,
              // both of which are encoded as arrays of objects
              const nodeValue = oldNode.value as MetaNode[];
              if (typeof key === "string") {
                // we assume that if the key is a string,
                // not a number then we are dealing with an object
                return nodeValue.find(item => item.key === key);
              } else {
                // the key is a number and we are dealing with an array
                return nodeValue[key];
              }
            }
          }, metaNode)
          node[insertKey] = insertNode;
          return metaNode
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
  resourceName: string,
  revision: number
}

export const selected: Writable<resourceInfo> = writable({
  dbName: null,
  dbType: null,
  resourceName: null,
  // there is no revision 0, but using 0 instead of null will signify that we are not using xquery view
  revision: 0
})