import { openDB } from "idb";
import { refresher } from "../store";
import { addToQueriesImpl, setInstanceSettingImpl } from "./db_utils";
async function openQueryDB() {
    return await openDB("SirixDBEnquirer", 2, {
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
            tx.put(500, "pagination-size");
            tx.put({ initialDepth: 4, lazyLoadDepth: 3 }, "lazy-loading");
            db.createObjectStore("instance-settings");
        }
    });
}
export const refreshQueries = refresher();
export const refreshSettings = refresher();
export async function getQueries(key) {
    const db = await openQueryDB();
    return await db.get("unbound_queries", key);
}
export async function addToQueries(key, text, flush) {
    const db = await openQueryDB();
    let queries = await db.get("unbound_queries", key);
    queries = addToQueriesImpl(queries, text, flush);
    await db.put("unbound_queries", queries, key);
    refreshQueries.refresh();
}
export async function removeFromQueriesByIndex(key, index) {
    const db = await openQueryDB();
    let queries = await db.get("unbound_queries", key);
    queries.splice(index, 1);
    await db.put("unbound_queries", queries, key);
    refreshQueries.refresh();
}
export async function getSettings(instanceUri) {
    const db = await openQueryDB();
    const globalLazyLoading = await db.get("global-settings", "lazy-loading");
    const globalPagination = await db.get("global-settings", "pagination-size");
    const instance = instanceUri ? await db.get("instance-settings", instanceUri) : undefined;
    const ret = Object.assign({ "global": { "pagination-size": globalPagination, "lazy-loading": globalLazyLoading } }, (instance && { instance }));
    return ret;
}
export async function setSetting(setting, value, instanceUri = undefined, database = undefined, resource = undefined) {
    const db = await openQueryDB();
    if (instanceUri === undefined) {
        db.put("global-settings", value, setting);
    }
    else {
        const current = await db.get("instance-settings", instanceUri);
        const toModify = setInstanceSettingImpl(database, resource, current, setting, value);
        db.put("instance-settings", toModify, instanceUri);
    }
    refreshSettings.refresh();
}
//# sourceMappingURL=browser_db.js.map