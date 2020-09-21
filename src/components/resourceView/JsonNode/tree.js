import { NodeType } from "sirixdb";
const traverse = (metaNode, path) => {
    // path is an array of strings and/or numbers,
    // which make up the sequence of keys to reach the intended node.
    // we can use reduce to iterate through the path, and filter
    // the MetaNode object
    return path.reduce((oldNode, key) => {
        if (key === null) {
            // if key is null, then return the `value` node of the current node.
            // this is used with OBJECT_ * _VALUE types,
            // as they don't have a key or index within the value field
            const node = oldNode;
            return node.value;
        }
        else {
            // we are going to assume that if a key is specified,
            // then we are dealing with an an object or array,
            // both of which are encoded as arrays of objects
            const node = oldNode;
            const nodes = node.value;
            if (typeof key === "string") {
                // we assume that if the key is a string,
                // not a number then we are dealing with an object
                return nodes.find(item => item.key === key);
            }
            else {
                // the key is a number and we are dealing with an array
                return nodes[key];
            }
        }
    }, metaNode);
};
const slice = (start, end, path, node, ref, results, countKeys = false) => {
    if (ref.index >= end)
        return results;
    if (ref.index >= start && ref.index <= end) {
        results.push([node, path]);
    }
    if (!node.expanded && node.metadata.type !== NodeType.OBJECT_KEY)
        return results;
    if (Array.isArray(node.value)) {
        for (let [index, entry] of node.value.entries()) {
            ref.index += 1;
            slice(start, end, path.concat(entry.key ? entry.key : index), entry, ref, results);
        }
    }
    else if (node.metadata.type === NodeType.OBJECT_KEY) {
        countKeys && ref.index++;
        slice(start, end, path.concat(null), node.value, ref, results);
    }
    return results;
};
const coalesce = (node, count = 0) => {
    count++;
    if (Array.isArray(node.value)) {
        count = node.value.map(item => coalesce(item)).reduce((acc, curr) => acc + curr, count);
    }
    else if (node.metadata.type === NodeType.OBJECT_KEY) {
        count--;
        count = coalesce(node.value, count);
    }
    return count;
};
const totalExpanded = (node, count = 0) => {
    count++;
    if (node.expanded && Array.isArray(node.value)) {
        count = node.value.map(item => totalExpanded(item)).reduce((acc, curr) => acc + curr, count);
    }
    else if (node.value.expanded && node.metadata.type === NodeType.OBJECT_KEY) {
        count--;
        count = totalExpanded(node.value, count);
    }
    return count;
};
export class JSONResource {
    constructor(metaNode) {
        this.metaNode = metaNode;
        this.totalExpanded = () => {
            return totalExpanded(this.metaNode);
        };
        this.slice = (start, end) => {
            return slice(start, end, [], this.metaNode, { index: 0 }, []);
        };
        this.get = (path) => {
            if (!this.metaNode)
                return undefined;
            return traverse(this.metaNode, path);
        };
        this.toggleProperty = (path, property) => {
            const node = traverse(this.metaNode, path);
            // node was not loaded yet, and we won't be able to access it's metadata. So don't do anything
            if (Object.keys(node).length === 0)
                return;
            node[property] = !node[property];
        };
        this.setProperty = (path, property, value) => {
            if (!this.metaNode)
                return;
            const node = traverse(this.metaNode, path);
            node[property] = value;
        };
        this.inject = (path, insertNode, insertKey = null) => {
            if (!this.metaNode)
                return false;
            let node = traverse(this.metaNode, path);
            if (insertKey === null) {
                node.value = insertNode;
                this.totalNodes += insertNode.map(coalesce).reduce((acc, curr) => acc + curr);
                return true;
            }
            else if (Array.isArray(node.value)) {
                if (typeof insertKey === "string") {
                    const nodeValue = node.value;
                    insertKey = nodeValue.findIndex(item => item.key === insertKey);
                }
                node.value[insertKey] = insertNode;
                return false;
            }
            return false;
        };
        this.totalNodes = coalesce(metaNode);
    }
}
export class JSONDiffs {
    constructor(diffResponse) {
        this.reset = (diffResponse) => {
            this.diffsMap = [];
            this.database = diffResponse.database;
            this.resource = diffResponse.resource;
            this.oldRevision = diffResponse["old-revision"];
            this.newRevision = diffResponse["new-revision"];
            this.add(diffResponse.diffs);
        };
        this.add = (diffs) => {
            diffs.forEach(diff => {
                switch (Object.keys(diff)[0]) {
                    case "replace":
                        this.diffsMap[diff.replace.oldNodeKey] = diff;
                        break;
                    case "insert":
                        this.diffsMap[diff.insert.insertPositionNodeKey] = diff;
                        break;
                    case "delete":
                        this.diffsMap[diff.delete.nodeKey] = diff;
                        break;
                    case "update":
                        this.diffsMap[diff.update.nodeKey] = diff;
                        break;
                }
            });
        };
        this.get = (nodeKey) => {
            return this.diffsMap[nodeKey];
        };
        this.reset(diffResponse);
    }
}
//# sourceMappingURL=tree.js.map