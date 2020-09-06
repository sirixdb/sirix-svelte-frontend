import {
    Dir,
    readTextFile,
    writeFile,
} from 'tauri/api/fs';

import { refresher } from "../store";
import { addToQueriesImpl, setInstanceSettingImpl } from './db_utils';

export const refreshQueries = refresher();
export const refreshSettings = refresher();

function initFile(path: string, initData: string): Promise<boolean> {
    return readTextFile(path, { dir: Dir.Data })
        .then(() => {
            return true;
        })
        .catch(() => {
            return writeFile({ path, contents: initData }, { dir: Dir.Data })
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return false;
                });
        });
}

const unboundQueriesPath = "unbound_queries";
const globalSettingsPath = "global-settings";
const instanceSettingsPath = "instance-settings";

export function init(): Promise<boolean> {
    return Promise.all([
        initFile(unboundQueriesPath, JSON.stringify({
            recents: [],
            favorites: [],
        })),
        initFile(globalSettingsPath, JSON.stringify({
            "pagination-size": 500,
            "lazy-loading": { initialDepth: 4, lazyLoadDepth: 3 },
        })),
        initFile(instanceSettingsPath, JSON.stringify({}))
    ])
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
}

export async function getQueries(key: string): Promise<string[]> {
    const blob = await readTextFile(unboundQueriesPath, { dir: Dir.Data });
    return JSON.parse(blob)[key];
}

export async function addToQueries(key: string, text: string, flush: boolean): Promise<void> {
    let blob = JSON.parse(await readTextFile(unboundQueriesPath, { dir: Dir.Data }));
    let queries = blob[key] as string[];
    queries = addToQueriesImpl(queries, text, flush);
    blob[key] = queries;
    await writeFile({ path: unboundQueriesPath, contents: JSON.stringify(blob) }, { dir: Dir.Data });
    refreshQueries.refresh();
}

export async function removeFromQueriesByIndex(key: string, index: number): Promise<void> {
    let blob = JSON.parse(await readTextFile(unboundQueriesPath, { dir: Dir.Data }));
    let queries = blob[key] as string[];
    queries.splice(index, 1);
    blob[key] = queries;
    await writeFile({ path: unboundQueriesPath, contents: JSON.stringify(blob) }, { dir: Dir.Data });
    refreshQueries.refresh();
}

export async function getSetting(setting: string, instanceUri: string) {
    const globalSetting = JSON.parse(await readTextFile(
        globalSettingsPath, { dir: Dir.Data }))[setting];
    const instance = JSON.parse(await readTextFile(
        instanceSettingsPath, { dir: Dir.Data }))[instanceUri];
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
    if (instanceUri === undefined) {
        const globalSettings = JSON.parse(await readTextFile(
            globalSettingsPath, { dir: Dir.Data }));
        globalSettings[setting] = value;
        writeFile({ path: globalSettingsPath, contents: JSON.stringify(globalSettings) }, { dir: Dir.Data });
    } else {
        const blob = JSON.parse(await readTextFile(
            instanceSettingsPath, { dir: Dir.Data }));
        const toModify = blob[instanceUri];
        blob[instanceUri] = setInstanceSettingImpl(database, resource, toModify, setting, value);
        writeFile({ path: instanceSettingsPath, contents: JSON.stringify(blob) }, { dir: Dir.Data });
    }
    refreshSettings.refresh();
}

