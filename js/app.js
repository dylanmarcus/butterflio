$(document).ready(function() {

    // TOOLBAR
    var summarizeButton = $('.btn-summarize');
    var fullTextSection = $('.section-full-text');
    var summarizedTextSection = $('.section-summarized-text');
    var textState = 'full';

    var shortText;
    function setText(domContent) {

        Mercury.parse(domContent).then(result => localStorage.setItem("content", result.content));

        // This sets the page's content with the full text.
        document.getElementById("fullText").innerHTML = localStorage.getItem("content");

        // This is the data for the SpeedReader
        localStorage.setItem('localText', document.getElementById('fullText').innerText);

        var divHeight = document.getElementById('fullText').offsetHeight;
        var lines = Math.floor(divHeight / 200);

        shortText = sum({ 'corpus' : localStorage.getItem("content"), 'nSentences' : lines});
        document.getElementById("shortText").innerHTML = shortText.summary;
    }

    chrome.runtime.sendMessage({from: 'app'}, setText);

    function doStuffWithDom(domContent) {

        chrome.runtime.onMessage.addListener(function (obj, sender, sendResponse) {
            if ( obj && obj.from === 'app' ) {
                sendResponse(domContent);
            }
        });

    }

    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    });

    summarizedTextSection.hide();

    summarizeButton.click(function() {
        console.log(textState);
        if (textState === 'full') {
            textState = 'summarized';
            summarizeButton.removeClass('btn--white').addClass('btn--green');
            fullTextSection.hide();
            summarizedTextSection.show();
        }

        else if (textState === 'summarized') {
            console.log('ass');
            textState = 'full';
            summarizeButton.removeClass('btn--green').addClass('btn--white');
            summarizedTextSection.hide();
            fullTextSection.show();
        }
    });

    // SPEED READ CLOSE
    var speedReadContent = $('.speed-read-popup__content');
    var speedReadButton = $('.btn-speed-read');
    var speedReadClose = $('.speed-read-popup__close');
    var speedReadCloseOuter = $('.stop-scrolling');

    speedReadButton.click(function() {
        speedReadContent.addClass('open');
        $('body').addClass('stop-scrolling')
    });

    speedReadClose.click(function() {
        speedReadContent.removeClass('open');
        $('body').removeClass('stop-scrolling')
    });

    $(speedReadCloseOuter).on('focusout', function () {
        alert("FUck you");
        speedReadContent.removeClass('open');
        $('body').removeClass('stop-scrolling')
    });

    function closeSpeedReadPopup() {
        if (speedReadContent.hasClass('open')) {
            speedReadContent.removeClass('open');
            $('body').removeClass('stop-scrolling');
        }
    }

    // close speed read popup on 'Escape' press or outside click
    $(document).on('keyup',function(evt) {
        if (evt.keyCode === 27) {
            closeSpeedReadPopup();
        }
    });

    $(document).mouseup(function(e) {
        if (!speedReadContent.is(e.target) && speedReadContent.has(e.target).length === 0) {
            closeSpeedReadPopup();
        }
    });

    // prevent spacebar scrolling when popup is open
    window.addEventListener('keydown', function(e) {
        if(e.keyCode === 32 && e.target === document.body) {
            if (speedReadContent.hasClass('open')) {
                e.preventDefault();
            }
        }
    });


    // Hide Images
    var images = document.getElementsByTagName('img');
    for (i = 0; i < images.length;i++ ) {
        images[i].style.display = "none";
        images[i].style.maxWidth = "70%";
    }
    var butt = document.getElementById('butt');
    butt.style.display = "block";

    // SPEED READ FUNCTIONALITY

    var wordDisplayText = $('.word');
    var setSpeedButton = $('.set-speed');
    var playButton = $('.play');
    var speedInput = $('#speed-input');
    var playing = false;
    var speed = speedInput[0].value;
    var waitTime = 60 / speed * 1000;


    var speedReadText = localStorage.getItem('localText');
    var speedReadWords = speedReadText.split(' ');

    var currentWord = 0;
    wordDisplayText.text(speedReadWords[currentWord]);
    function speedRead() {
        if (playing) {
            if (currentWord === speedReadWords.length) {
                speedReadPause();
                currentWord = 0;
            }
            else {
                waitTime = 60 / speed * 1000;
                if (currentWord > 0) {
                    var nextWordText = speedReadWords[currentWord - 1];
                    if (nextWordText[nextWordText.length - 1] === '.') {
                        waitTime *= 2;
                    }
                    if (nextWordText[nextWordText.length - 1] === ',') {
                        waitTime *= 1.5;
                    }
                }
                setTimeout(function() {
                    wordDisplayText.text(speedReadWords[currentWord]);
                    currentWord++;
                    if (currentWord <= speedReadWords.length) {
                        speedRead();
                    }
                }, waitTime);
            }
        }
    }

    function setSpeed() {
        
    }
    
    function speedReadPlay() {
        playButton.text('pause');
        playing = true;
        speedRead();
    }

    function speedReadPause() {
        playButton.text('play');
        playing = false;
    }

    playButton.click(function() {
        if (playing) {
            speedReadPause();
        }
        else {
            speedReadPlay();
        }
    });

    // play or pause with spacebar
    $(document).on('keyup',function(evt) {
        if (evt.keyCode === 32) {
            if (speedReadContent.hasClass('open')) {
                if (playing) {
                    speedReadPause();
                }
                else {
                    speedReadPlay();
                }
            }
        }
    });

    setSpeedButton.click(function() {
        speed = speedInput[0].value;
    });

});

