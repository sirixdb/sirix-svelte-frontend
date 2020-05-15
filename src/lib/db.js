import { openDB } from "idb";
import { refresher } from "../store";

export async function openQueryDB() {
    return await openDB("SirixDBEnquirer", 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            // this is a migration method, called on creating
            // a DB with a version that did not previously exist
            db.createObjectStore("unbound_queries");
            const tx = transaction.objectStore("unbound_queries");
            tx.put([], "recents");
            tx.put([], "favorites");
        }
    });
}

export const refreshQueries = refresher();

export async function addToQueries(store, text, flush) {
    const db = await openQueryDB();
    let queries = await db.get("unbound_queries", store);
    queries = queries.filter(query => query !== text);
    queries.unshift(text);
    if (flush && queries.length > 10) {
        queries = queries.slice(0, 10);
    }
    await db.put("unbound_queries", queries, store);
    refreshQueries.refresh();
}

export async function removeFromQueriesByIndex(store, index) {
    const db = await openQueryDB();
    let queries = await db.get("unbound_queries", store);
    queries.splice(index, 1);
    await db.put("unbound_queries", queries, store);
    refreshQueries.refresh();
}
