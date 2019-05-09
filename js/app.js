$(document).ready(function() {

    // TOOLBAR
    var summarizeButton = $('.btn-summarize');
    var fullTextSection = $('.section-full-text');
    var summarizedTextSection = $('.section-summarized-text');
    var textState = 'full';
    var shortText;

    function setText(domContent) {
        //Mercury.parse(domContent).then(result => localStorage.setItem("content", result.content));
        //Mercury.parse(domContent).then(result => console.log(result));
        console.log(domContent);
        localStorage.setItem("content", domContent);

        // This sets the page's content with the full text.
        document.getElementById("fullText").innerHTML = localStorage.getItem("content");

        // This is the data for the SpeedReader
        localStorage.setItem('localText', document.getElementById('fullText').innerText);

        var divHeight = document.getElementById('fullText').offsetHeight;
        var lines = Math.floor(divHeight / 300);

        shortText = sum({ 'corpus' : localStorage.getItem("content"), 'nSentences' : lines});
        shortText = shortText.sentences;
        for (var i = 0; i < shortText.length; i++) {
            shortText[i] += ".<br><br>";
        }
        shortText = shortText.join("");
        document.getElementById("shortText").innerHTML = shortText;
    }

    chrome.runtime.sendMessage({from: 'app'}, setText);

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
        $('body').addClass('stop-scrolling');
    });

    speedReadClose.click(function() {
        speedReadContent.removeClass('open');
        $('body').removeClass('stop-scrolling');
    });

    $(speedReadCloseOuter).on('focusout', function () {
        if (speedReadContent.hasClass('open')) {
            speedReadContent.removeClass('close');
            $('body').removeClass('stop-scrolling');
        }
    });

    function closeSpeedReadPopup() {
        if (speedReadContent.hasClass('open')) {
            speedReadContent.removeClass('open');
            $('body').removeClass('stop-scrolling');
            window.location.replace("index.html");
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

    // SPEED READ FUNCTIONALITY

    var wordDisplayText = $('.word');
    var setSpeedSlowButton = $('.set-speed-slow');
    var setSpeedMediumButton = $('.set-speed-medium');
    var setSpeedFastButton = $('.set-speed-fast');
    var playButton = $('.play');
    var playing = false;
    var speed = 300;
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

    setSpeedSlowButton.click(function() {
        speed = 150;
        setSpeedSlowButton.removeClass('btn--white').addClass('btn--green');
        setSpeedMediumButton.removeClass('btn--green').addClass('btn--white');
        setSpeedFastButton.removeClass('btn--green').addClass('btn--white');
    });

    setSpeedMediumButton.click(function() {
        speed = 300;
        setSpeedMediumButton.removeClass('btn--white').addClass('btn--green');
        setSpeedSlowButton.removeClass('btn--green').addClass('btn--white');
        setSpeedFastButton.removeClass('btn--green').addClass('btn--white');
    });

    setSpeedFastButton.click(function() {
        speed = 500;
        setSpeedFastButton.removeClass('btn--white').addClass('btn--green');
        setSpeedMediumButton.removeClass('btn--green').addClass('btn--white');
        setSpeedSlowButton.removeClass('btn--green').addClass('btn--white');
    });

    window.onbeforeunload = function () {
        chrome.runtime.reload();
    };

});

