// https://stackoverflow.com/a/7220510/12058591
export function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'text-green-600';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                // key
                // leaving this here for the future
                cls = '';
            } else {
                // string
                cls = 'text-orange-900';
            }
        } else if (/true|false/.test(match)) {
            cls = 'text-indigo-600';
        } else if (/null/.test(match)) {
            cls = 'text-indigo-600';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}