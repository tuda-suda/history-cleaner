/*
    Main script for extension pop-up.
*/

function onError(error) {
    console.log(error)
}

function storeKeywords() {
    browser.storage.local.get('keywords')
        .then(existing_kw => {
            const old_kw = existing_kw.keywords || []

            const keywords_input = document.getElementById('keywords')
            var keywords_list = keywords_input.value.split(' ');

            if (!keywords_list) { keywords_list = [] }
            keywords_list = [...new Set([...old_kw, ...keywords_list])]

            if (keywords_list.length > 0) {
                browser.storage.local
                    .set({keywords: keywords_list})
                    .catch(onError);
            }

            if (document.getElementById('content').style.display === "block") {
                renderLI(keywords_list);
            }

            keywords_input.value = '';
        }).catch(onError);
}

function renderLI(elements) {
    const list = document.getElementById('list');
    list.innerText = ''

    elements.forEach(element => {
        var node = document.createElement("li");
        node.innerText = element;
        list.appendChild(node);
    });
}

function showKeywords(item) {
    const keywords = item.keywords;
    const content = document.getElementById('content');

    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
        renderLI(keywords);
    }  
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('button');

    button.addEventListener('click', () => {
        storeKeywords();
    });

    const collapsible = document.getElementById('collapsible');

    collapsible.addEventListener('click', () => {
        browser.storage.local
            .get('keywords')
            .then(showKeywords, onError);
    });
});

