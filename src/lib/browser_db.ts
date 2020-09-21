import { openDB } from "idb";
import { refresher } from "../store";
import { addToQueriesImpl } from "./db_utils";
import type { Schema, Setting, SettingValue, Settings } from "./db_utils";


async function openQueryDB() {
  return await openDB<Schema>("SirixDBEnquirer", 2, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // this is a migration method, called on creating
      // a DB with a version that did not previously exist
      if (oldVersion != 1) {
        db.createObjectStore("unbound_queries");
        const tx = transaction.objectStore("unbound_queries");
        tx.put([], "recents");
        tx.put([], "favorites");
      }
      // settings to default to, regardless of which SirixDB instance is accessed,
      // unless overriden by instance-settings, or db-settings, or resource-settings
      db.createObjectStore("global-settings");
      const tx = transaction.objectStore("global-settings");
      tx.put(100, "pagination-size");
      tx.put({ initialDepth: 4, lazyLoadDepth: 3 }, "lazy-loading");
    }
  });
}

export const refreshQueries = refresher();
export const refreshSettings = refresher();

export async function getQueries(key: string) {
  const db = await openQueryDB();
  return await db.get("unbound_queries", key);
}

export async function addToQueries(key: string, text: string, flush: boolean): Promise<void> {
  const db = await openQueryDB();
  let queries = await db.get("unbound_queries", key);
  queries = addToQueriesImpl(queries, text, flush);
  await db.put("unbound_queries", queries, key);
  refreshQueries.refresh();
}

export async function removeFromQueriesByIndex(key: string, index: number): Promise<void> {
  const db = await openQueryDB();
  let queries = await db.get("unbound_queries", key);
  queries.splice(index, 1);
  await db.put("unbound_queries", queries, key);
  refreshQueries.refresh();
}

export async function getSettings(instanceUri?: string): Promise<Settings> {
  const db = await openQueryDB();
  const globalLazyLoading = await db.get("global-settings", "lazy-loading") as SettingValue<"lazy-loading">;
  const globalPagination = await db.get("global-settings", "pagination-size") as SettingValue<"pagination-size">;
  const ret = { "pagination-size": globalPagination, "lazy-loading": globalLazyLoading };
  return ret;
}

export async function setSetting<T extends Setting>(
  setting: T,
  value: SettingValue<T>,
): Promise<void> {
  const db = await openQueryDB();
  db.put("global-settings", value, setting);
  refreshSettings.refresh();
}
