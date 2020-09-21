import type { DBSchema } from "idb";

export interface DataLoadSettings {
  initialDepth: number;
  lazyLoadDepth: number;
}

export type Setting = "pagination-size" | "lazy-loading";

export type SettingValue<T> = T extends "pagination-size" ? number : T extends "lazy-loading" ? DataLoadSettings : never;

export interface Settings {
  "lazy-loading": SettingValue<"lazy-loading">;
  "pagination-size": SettingValue<"pagination-size">;
};

export interface Schema extends DBSchema {
  "unbound_queries": {
    key: string;
    value: string[];
  };
  "global-settings": {
    key: Setting;
    value: number | DataLoadSettings;
  }
}

export function addToQueriesImpl(queries: string[], text: string, flush: boolean): string[] {
  queries = queries.filter(query => query !== text);
  queries.unshift(text);
  if (flush && queries.length > 10) {
    queries = queries.slice(0, 10);
  }
  return queries;
}
