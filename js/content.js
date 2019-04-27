'use strict';

function doStuffWithDom(domContent) {

    localStorage.setItem("longText", domContent);

    chrome.runtime.onMessage.addListener(function (obj, sender, sendResponse) {
        if ( obj && obj.from === 'app' ) {
            sendResponse(domContent);
        }
    });

    chrome.tabs.create({'url':"index.html"})

}

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
});
