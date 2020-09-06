export function addToQueriesImpl(queries: string[], text: string, flush: boolean): string[] {
    queries = queries.filter(query => query !== text);
    queries.unshift(text);
    if (flush && queries.length > 10) {
        queries = queries.slice(0, 10);
    }
    return queries;
}

export function setInstanceSettingImpl(
    database: string | undefined,
    resource: string | undefined,
    toModify: object,
    setting: string,
    value
) {
    if (database !== undefined) {
        toModify = toModify["databases"][database];
        if (resource !== undefined) {
            toModify = toModify["resources"][resource];
        }
    }
    toModify[setting] = value;
    return toModify;
}