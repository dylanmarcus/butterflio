// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        //alert("URL: "+window.location.href);
        sendResponse(window.location.href);
    }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'app') {
        //alert("APP_URL: "+window.location.href);
        sendResponse(window.location.href);
    }
});