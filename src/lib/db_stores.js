import { writable } from "svelte/store";
import * as tauri_db from "./tauri_db";
import * as browser_db from "./browser_db";
//@ts-ignore
const { getSettings, setSetting } = process.tauri ? tauri_db : browser_db;
const buildStoreObj = (global, instance) => {
    return Object.assign({ globalPagination: global["pagination-size"], globalInitialDepth: global["lazy-loading"].initialDepth, globalLazyLoadDepth: global["lazy-loading"].lazyLoadDepth }, (instance && {
        instancePagination: instance["pagination-size"],
        instanceInitialDepth: instance["lazy-loading"].initialDepth,
        instanceLazyLoadDepth: instance["lazy-loading"].lazyLoadDepth,
        databases: instance.databases,
    }));
};
const createSettingsStore = async (instanceUri = undefined) => {
    const { global, instance } = await getSettings(instanceUri);
    const { subscribe, set } = writable(buildStoreObj(global, instance));
    return {
        subscribe,
        setPagination: async (newPage, instanceUri, database, resource) => {
            await setSetting("pagination-size", newPage, instanceUri, database, resource);
            const { global, instance } = await getSettings(instanceUri);
            set(buildStoreObj(global, instance));
        },
        setLazyLoadIng: async (newSetting, instanceUri, database, resource) => {
            await setSetting("lazy-loading", newSetting, instanceUri, database, resource);
            const { global, instance } = await getSettings(instanceUri);
            set(buildStoreObj(global, instance));
        },
    };
};
export const settingsStore = await createSettingsStore();
//# sourceMappingURL=db_stores.js.map