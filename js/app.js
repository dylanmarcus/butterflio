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
    var prevButton = $('.prev');
    var playButton = $('.play');
    var nextButton = $('.next');
    var playing = false;

    var speedReadText = "You are reading pretty damn quick. Bet you didn't think you could do that, huh. Don't you feel smart now?";
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
                setTimeout(function() {
                    wordDisplayText.text(speedReadWords[currentWord]);
                    currentWord++;
                    if (currentWord <= speedReadWords.length) {
                        speedRead();
                    }
                }, 200);
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

});