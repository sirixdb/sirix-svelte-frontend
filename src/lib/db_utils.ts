import type { DBSchema } from "idb";

export interface DataLoadSettings {
    initialDepth: number;
    lazyLoadDepth: number;
}

export type Setting = "pagination-size" | "lazy-loading";

export type SettingValue<T> = T extends "pagination-size" ? number : T extends "lazy-loading" ? DataLoadSettings : never;

export interface Settings {
    global: GlobalSettings;
    instance?: InstanceSettings;
}

export interface GlobalSettings {
    "lazy-loading": SettingValue<"lazy-loading">;
    "pagination-size": SettingValue<"pagination-size">;
};

export interface InstancesDatabases {
    // database name
    [key: string]: {
        resources?: {
            // resource name
            [key: string]: {
                "pagination-size"?: number;
                "lazy-loading"?: DataLoadSettings;
            }
        },
    }
}

export interface InstanceSettings {
    "pagination-size": number;
    "lazy-loading": DataLoadSettings;
    databases?: InstancesDatabases;
}

export interface Schema extends DBSchema {
    "unbound_queries": {
        key: string;
        value: string[];
    };
    "global-settings": {
        key: Setting;
        value: number | DataLoadSettings;
    }
    "instance-settings": {
        key: string;
        value: InstanceSettings;
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

export function setInstanceSettingImpl<T extends Setting>(
    database: string | undefined,
    resource: string | undefined,
    toModify: any,
    setting: T,
    value: SettingValue<T>
): InstanceSettings {
    if (database !== undefined && resource !== undefined) {
        toModify = toModify["resources"][resource];
    }
    toModify[setting] = value;
    return toModify;
}
