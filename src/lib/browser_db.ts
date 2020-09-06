import { openDB, DBSchema } from "idb";
import { refresher } from "../store";
import { addToQueriesImpl, setInstanceSettingImpl } from "./db_utils";

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
            tx.put(500, "pagination-size");
            tx.put({ initialDepth: 4, lazyLoadDepth: 3 }, "lazy-loading");
            db.createObjectStore("instance-settings");
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

export async function getSetting(setting: string, instanceUri: string) {
    const db = await openQueryDB();
    const globalSetting = await db.get("global-settings", setting);
    const instance = await db.get("instance-settings", instanceUri);
    const ret = { "global": globalSetting }
    if (instance !== undefined) {
        ret["instance"] = instance;
    }
    return ret;
}

export async function setSetting(
    setting: string,
    value,
    instanceUri = undefined,
    database = undefined,
    resource = undefined
): Promise<void> {
    const db = await openQueryDB();
    if (instanceUri === undefined) {
        db.put("global-settings", value, setting);
    } else {
        const current = await db.get("instance-settings", instanceUri);
        const toModify = setInstanceSettingImpl(database, resource, current, setting, value);
        // TODO once typings are completed, remove `as dataLoadSettings`
        db.put("instance-settings", toModify as dataLoadSettings, instanceUri);
    }
    refreshSettings.refresh();
}
