
$( document ).ready(function() {
    setTimeout(function() {
        pageResize();
    }, 0);
});


$(window).on('resize', pageResize);
$(window).on('resize', pageCenter);




function welcomeImage() {
    $('#welcome-image-2').animate({opacity: 1});
    $('#gold-page-1').attr('style', 'opacity: 0')
        .animate({opacity: 1});
    $('.gold-page-1').attr('style', 'opacity: 0')
        .animate({opacity: 1});

}

function scrollDownArrow() {
$('img.scroll-down').attr('style', 'display: block !important; opacity: 0')
        .delay(1000).animate({opacity: 1});
}

function pageCenter() {

    if ($(window).width > 1024) {

      $('#welcome-screen').css({
            position:'absolute',
            left: ($(window).width() - $('#welcome-screen').outerWidth())/2,
            top: ($(window).height() - $('#welcome-screen').outerHeight())/2,
            'margin-top': 0,
            'margin-left': 0
        });
      $('.gold-page-1').css({
            position:'absolute',
            left: ($(window).width() - $('#welcome-screen').outerWidth())/2,
            top: ($(window).height() - $('#welcome-screen').outerHeight())/2,
            'margin-top': 0,
            'margin-left': '-20px'
        });

        $('.black-page-1').css({
            position:'absolute',
            left: ($(window).width() - $('#welcome-screen').outerWidth())/2,
            top: ($(window).height() - $('#welcome-screen').outerHeight())/2,
            'margin-top': '-20px',
            'margin-left': '-20px'
        });

        $('.gold-page-2').css({
            position:'absolute',
            left: ($(window).width() - $('#welcome-screen').outerWidth())/2,
            top: ($(window).height() - $('#welcome-screen').outerHeight())/2,
            'margin-top': '-70px',
            'margin-left': '70px'
        });
        $('.black-page-2').css({
            position:'absolute',
            left: ($(window).width() - $('#welcome-screen').outerWidth())/2,
            top: ($(window).height() - $('#welcome-screen').outerHeight())/2,
            'margin-top': '-20px',
            'margin-left': '-20px'
        });
    }
}

//Function that determines the height and width of div that #welcome-image is in

function pageResize() {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        $('.pagescrollhome').css({'width':windowWidth ,'height':windowHeight });
}




/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery)





// Relevant code

var lastAnimation = 0;
var animationTime = 1000; // in ms
var quietPeriod = 500; // in ms, time after animation to ignore mousescroll

function scrollThis(event, delta, deltaX, deltaY) {
    var timeNow = new Date().getTime();

    // change this to deltaX/deltaY depending on which
    // scrolling dir you want to capture
    deltaOfInterest = deltaY;

    if (deltaOfInterest == 0) {
        // Uncomment if you want to use deltaX
        // event.preventDefault();
        return;
    }

    // Cancel scroll if currently animating or within quiet period
    if(timeNow - lastAnimation < quietPeriod + animationTime) {
        event.preventDefault();
        return;
    }

    if (deltaOfInterest < 0) {
        if ($('.active').next('.pagescrollhome').length) {
            lastAnimation = timeNow;
            $('.active').removeClass('active').next('.pagescrollhome').addClass('active');
            $('html,body').animate( {
                scrollTop: $('.active').offset().top }, animationTime);
        }
    } else {
        if ($('.active').prev('.pagescrollhome').length) {
            lastAnimation = timeNow;
            $('.active').removeClass('active').prev('.pagescrollhome').addClass('active');
            $('html,body').animate( {
                scrollTop: $('.active').offset().top }, animationTime);
        }
    }
}

$(document).mousewheel(scrollThis);