$(document).ready(function() {

    // TOOLBAR
    var summarizeButton = $('.btn-summarize');
    var fullTextSection = $('.section-full-text');
    var summarizedTextSection = $('.section-summarized-text');
    var textState = 'full';

    summarizeButton.click(function() {
        console.log(textState);
        if (textState == 'full') {
            textState = 'summarized';
            summarizeButton.removeClass('btn--white').addClass('btn--green');
            fullTextSection.hide();
            summarizedTextSection.show();
        }

        else if (textState == 'summarized') {
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

    speedReadButton.click(function() {
        speedReadContent.addClass('open');        
    });

    speedReadClose.click(function() {
        speedReadContent.removeClass('open');        
    });

    function closeSpeedReadPopup() {
        if (speedReadContent.hasClass('open')) {
            var url = window.location.href.split("/");
                if (url[url.length - 1].length < 1) {
                    url = url.splice(url.length - 1, 1);
                }
                url[url.length - 1] = '#';
                url = url.join("/");
                window.location.replace(url);
                speedReadContent.removeClass('open');
        }
    }

    // close speed read popup on 'Escape' press or outside click
    $(document).on('keyup',function(evt) {
        if (evt.keyCode == 27) {
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
        if(e.keyCode == 32 && e.target == document.body) {
            if (speedReadContent.hasClass('open')) {
                e.preventDefault();
            }
        }
    });


    // SPEED READ FUNCTIONALITY

    var wordDisplayText = $('.word');
    var setSpeedButton = $('.set-speed');
    var playButton = $('.play');
    var speedInput = $('#speed-input');
    var playing = false;
    var speed = speedInput[0].value;
    var waitTime = 60 / speed * 1000;

    var speedReadText = localStorage.getItem("longText");
    window.onload = alert(localStorage.getItem("longText"));
    window.onload = alert(speedReadText);
    //var speedReadText = "IN THE year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the Army. Having completed my studies there, I was duly attached to the Fifth Northumberland Fusiliers as assistant surgeon. The regiment was stationed in India at the time, and before I could join it, the second Afghan war had broken out. On landing at Bombay, I learned that my corps had advanced through the passes, and was already deep in the enemy's country. I followed, however, with many other officers who were in the same situation as myself, and succeeded in reaching Candahar in safety, where I found my regiment, and at once entered upon my new duties.";
    var speedReadWords = speedReadText.split(' ');

    var currentWord = 0;
    wordDisplayText.text(speedReadWords[currentWord]);
    function speedRead() {
        if (playing) {
            if (currentWord == speedReadWords.length) {
                speedReadPause();
                currentWord = 0;
            }
            else {
                waitTime = 60 / speed * 1000;
                if (currentWord > 0) {
                    var nextWordText = speedReadWords[currentWord - 1];
                    if (nextWordText[nextWordText.length - 1] == '.') {
                        waitTime *= 2;
                    }
                    if (nextWordText[nextWordText.length - 1] == ',') {
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
        if (evt.keyCode == 32) {
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

