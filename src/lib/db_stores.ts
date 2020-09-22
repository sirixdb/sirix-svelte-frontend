import { writable } from "svelte/store";

import * as tauri_db from "./tauri_db";
import * as browser_db from "./browser_db";
import type { DataLoadSettings, Settings } from "./db_utils";
//@ts-ignore
const { getSettings, setSetting } = process.tauri ? tauri_db : browser_db;

const createSettingsStore = () => {
  const { subscribe, update, set } = writable<Settings>(undefined);
  return {
    init: async () => {
      set(await getSettings());
    },
    subscribe,
    setPagination: async (newPage: number) => {
      await setSetting("pagination-size", newPage);
      update(old => {
        return { ...old, "pagination-size": newPage };
      })
    },
    setLazyLoadIng: async (newSetting: DataLoadSettings) => {
      await setSetting("lazy-loading", newSetting);
      update(old => {
        return { ...old, "lazy-loading": newSetting };
      })
    },
  }
}

export const settingsStore = createSettingsStore();

//@ts-ignore
if (process.browser) {
  settingsStore.init()
}
