'use strict';

function doStuffWithDom(domContent) {

    chrome.runtime.onMessage.addListener(function (obj, sender, sendResponse) {
        if ( obj && obj.from === 'app' ) {
            //chrome.extension.sendMessage({text: 'report_back'}, doStuffWithDom);
            sendResponse(domContent);
        }
    });


    // Close already open tabs of Butterflio
    chrome.tabs.getAllInWindow(null, function(tabs){
        var openAlready = 0;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].title === "Butterflio") {
                openAlready = 1;
                chrome.tabs.update(tabs[i].id, {active: true});
                chrome.tabs.reload();
            }
        }
        if (openAlready === 0) {
            chrome.tabs.create({'url':"index.html"});
        }
    });
}

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);

});