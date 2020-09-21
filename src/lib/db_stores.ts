import { writable } from "svelte/store";

import * as tauri_db from "./tauri_db";
import * as browser_db from "./browser_db";
import type { DataLoadSettings, GlobalSettings, InstancesDatabases, InstanceSettings } from "./db_utils";
//@ts-ignore
const { getSettings, setSetting } = process.tauri ? tauri_db : browser_db;

interface SettingsStore {
    instancePagination: number;
    instanceInitialDepth: number;
    instanceLazyLoadDepth: number;
    databases: InstancesDatabases,
    globalPagination: number;
    globalInitialDepth: number;
    globalLazyLoadDepth: number;
}

const buildStoreObj = (global: GlobalSettings, instance: InstanceSettings): SettingsStore => {
    return {
        globalPagination: global["pagination-size"],
        globalInitialDepth: global["lazy-loading"].initialDepth,
        globalLazyLoadDepth: global["lazy-loading"].lazyLoadDepth,

        ...(instance && {
            instancePagination: instance["pagination-size"],
            instanceInitialDepth: instance["lazy-loading"].initialDepth,
            instanceLazyLoadDepth: instance["lazy-loading"].lazyLoadDepth,

            databases: instance.databases,
        }),
    }
}

const createSettingsStore = async (instanceUri: string = undefined) => {
    const { global, instance } = await getSettings(instanceUri);
    const { subscribe, set } = writable(buildStoreObj(global, instance));
    return {
        subscribe,
        setPagination: async (newPage: number, instanceUri?: string, database?: string, resource?: string) => {
            await setSetting("pagination-size", newPage, instanceUri, database, resource);
            const { global, instance } = await getSettings(instanceUri)
            set(buildStoreObj(global, instance));
        },
        setLazyLoadIng: async (newSetting: DataLoadSettings, instanceUri?: string, database?: string, resource?: string) => {
            await setSetting("lazy-loading", newSetting, instanceUri, database, resource);
            const { global, instance } = await getSettings(instanceUri)
            set(buildStoreObj(global, instance));
        },
    }
}
export const settingsStore = await createSettingsStore();