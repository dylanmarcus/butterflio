// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';



var theText = document.body.innerText;
localStorage.setItem("longText", theText);



chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({'url':"chrome://newtab"})
});
