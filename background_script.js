/* 
    Background script handles browser history manipulation

    Upon loading the extension for the first time and on each change to 
    keywords clearAll() will search the browser history for matches of keywords 
    using regex and delete the URLs, if they match.

    Upon visiting a page deleteURL() will delete the URL of page from history
    if it matches any keyword.
*/

const state = {
    keywords: []
}

function onError(error) {
    console.log(error);
}

browser.history.onVisited.addListener(deleteURL);
browser.storage.onChanged.addListener((changes, area) => {
    state.keywords = changes.keywords.newValue;
    clearAll();
});

browser.storage.local
    .get('keywords')
    .then(res => {
        state.keywords = res.keywords;
    }).catch(onError);


function deleteURL(historyItem) {
    state.keywords.forEach(kw => {
        const kwRegExp = new RegExp(kw, 'ig');
        if (kwRegExp.test(historyItem.url) || kwRegExp.test(historyItem.title)) {
            browser.history.deleteUrl({url: historyItem.url});
        }
    })
}

function clearAll() {
    browser.history
        .search({
            text: "", 
            maxResults: 10000
        }).then(history => {
            history.forEach(item => {
                deleteURL(item);
            })
        }).catch(onError);
}

clearAll();