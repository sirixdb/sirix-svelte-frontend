import {
  Dir,
  readTextFile,
  writeFile,
} from 'tauri/api/fs';

import { refresher } from "../store";
import { addToQueriesImpl, SettingValue } from './db_utils';
import type { Settings, Setting } from "./db_utils";

export const refreshQueries = refresher();
export const refreshSettings = refresher();

function initFile(path: string, initData: string): Promise<boolean> {
  return readTextFile(path, { dir: Dir.App })
    .then(() => {
      return true;
    })
    .catch(() => {
      return writeFile({ path, contents: initData }, { dir: Dir.App })
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

export function init(): Promise<boolean> {
  return Promise.all([
    initFile(unboundQueriesPath, JSON.stringify({
      recents: [],
      favorites: [],
    })),
    initFile(globalSettingsPath, JSON.stringify({
      "pagination-size": { maxChildren: 100, numberOfNodes: 750 },
      "lazy-loading": { initialDepth: 4, lazyLoadDepth: 3 },
    })),
  ])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function getQueries(key: string): Promise<string[]> {
  const blob = await readTextFile(unboundQueriesPath, { dir: Dir.App });
  return JSON.parse(blob)[key];
}

export async function addToQueries(key: string, text: string, flush: boolean): Promise<void> {
  let blob = JSON.parse(await readTextFile(unboundQueriesPath, { dir: Dir.App }));
  let queries = blob[key] as string[];
  queries = addToQueriesImpl(queries, text, flush);
  blob[key] = queries;
  await writeFile({ path: unboundQueriesPath, contents: JSON.stringify(blob) }, { dir: Dir.App });
  refreshQueries.refresh();
}

export async function removeFromQueriesByIndex(key: string, index: number): Promise<void> {
  let blob = JSON.parse(await readTextFile(unboundQueriesPath, { dir: Dir.App }));
  let queries = blob[key] as string[];
  queries.splice(index, 1);
  blob[key] = queries;
  await writeFile({ path: unboundQueriesPath, contents: JSON.stringify(blob) }, { dir: Dir.App });
  refreshQueries.refresh();
}

export async function getSettings(): Promise<Settings> {
  const globalSettings = JSON.parse(await readTextFile(
    globalSettingsPath, { dir: Dir.App })) as Settings;
  const ret = {
    "pagination-size": globalSettings["pagination-size"],
    "lazy-loading": globalSettings["lazy-loading"]
  };
  return ret;
}

export async function setSetting<T extends Setting>(
  setting: T,
  value: SettingValue<T>
): Promise<void> {
  const globalSettings = JSON.parse(await readTextFile(
    globalSettingsPath, { dir: Dir.App }));
  globalSettings[setting] = value;
  writeFile({ path: globalSettingsPath, contents: JSON.stringify(globalSettings) }, { dir: Dir.App });
  refreshSettings.refresh();
}

