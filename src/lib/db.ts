import { openDB, DBSchema } from "idb";
import { refresher } from "../store";

interface dataLoadSettings {
    initialDepth: number;
    lazyLoadDepth: number;
}

interface Schema extends DBSchema {
    "unbound_queries": {
        key: string;
        value: string[];
    };
    "global-settings": {
        key: string;
        value: number | dataLoadSettings;
    }
    "instance-settings": {
        key: string;
        // TODO complete typings here
        value: dataLoadSettings;
    }
}

export async function openQueryDB() {
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
            tx.put(500, "pagination-size");
            tx.put({ initialDepth: 4, lazyLoadDepth: 3 }, "lazy-loading");
            db.createObjectStore("instance-settings");
        }
    });
}

export const refreshQueries = refresher();
export const refreshSettings = refresher();

export async function addToQueries(store, text, flush) {
    const db = await openQueryDB();
    let queries = await db.get("unbound_queries", store);
    queries = queries.filter(query => query !== text);
    queries.unshift(text);
    if (flush && queries.length > 10) {
        queries = queries.slice(0, 10);
    }
    await db.put("unbound_queries", queries, store);
    refreshQueries.refresh();
}

export async function removeFromQueriesByIndex(store, index) {
    const db = await openQueryDB();
    let queries = await db.get("unbound_queries", store);
    queries.splice(index, 1);
    await db.put("unbound_queries", queries, store);
    refreshQueries.refresh();
}

export async function getSetting(setting, instanceUri) {
    const db = await openQueryDB();
    const globalSetting = await db.get("global-settings", setting);
    const instance = await db.get("instance-settings", instanceUri);
    const ret = { "global": globalSetting }
    if (instance !== undefined) {
        ret["instance"] = instance;
    }
    return ret;
}

export async function setSetting(setting, value, instanceUri = undefined, database = undefined, resource = undefined) {
    const db = await openQueryDB();
    if (instanceUri === undefined) {
        db.put("global-settings", value, setting);
    } else {
        const current = await db.get("instance-settings", instanceUri);
        let toModify = current;
        if (database !== undefined) {
            toModify = toModify["databases"][database];
            if (resource !== undefined) {
                toModify = toModify["resources"][resource];
            }
        }
        toModify[setting] = value;
        db.put("instance-settings", toModify, instanceUri);
    }
    refreshSettings.refresh();
}
