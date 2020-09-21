import { writable } from "svelte/store";

import * as tauri_db from "./tauri_db";
import * as browser_db from "./browser_db";
import type { DataLoadSettings, Settings } from "./db_utils";
//@ts-ignore
const { getSettings, setSetting } = process.tauri ? tauri_db : browser_db;

const createSettingsStore = async (instanceUri: string = undefined) => {
  //@ts-ignore
  if (process.browser) {
    var settings = await getSettings(instanceUri);
  }
  const { subscribe, update } = writable(settings || {});
  return {
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

let settingsStore;
(async () => {
  settingsStore = await createSettingsStore();
})();

export { settingsStore };
