import { openDB } from "idb";

export async function openQueryDB() {
    return await openDB("SirixDBEnquirer", 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            // this is a migration method, called on creating
            // a DB with a version that did not previously exist
            db.createObjectStore("global_queries");
        }
    });
}