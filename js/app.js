$(document).ready(function() {

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

});