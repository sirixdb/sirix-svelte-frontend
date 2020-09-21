;
export function addToQueriesImpl(queries, text, flush) {
    queries = queries.filter(query => query !== text);
    queries.unshift(text);
    if (flush && queries.length > 10) {
        queries = queries.slice(0, 10);
    }
    return queries;
}
export function setInstanceSettingImpl(database, resource, toModify, setting, value) {
    if (database !== undefined && resource !== undefined) {
        toModify = toModify["resources"][resource];
    }
    toModify[setting] = value;
    return toModify;
}
//# sourceMappingURL=db_utils.js.map