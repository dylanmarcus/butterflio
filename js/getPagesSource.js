// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        var x = document.getElementsByClassName("content-column");
        sendResponse(x[0].outerHTML);
    }
});