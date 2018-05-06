var mediaBOOM = new MediaBoomSite();

mediaBOOM.pageTransitionIn = function($container, $content_in, done) {
	done();
};

mediaBOOM.pageTransitionOut = function($container, $content_out, done) {
	done();
};

var fadeTransitionInOut = function($container, $content_out, $content_in, done) {
	var out_height = $content_out.height(),
		in_height = $content_in.height(),
		speed = 500;

	$content_out.css({
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'right': 0
	});

	$content_in.css({
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'right': 0,
		'opacity': 0
	});

	$content_out.transition({
		'opacity': 0
	}, speed);

	$content_out.promise().done(function() {
		var after_video = function() {
			$(window).scrollTop(0);
			$content_in.animate({
				'opacity': 1
			}, speed, function() {
				$container.removeAttr('style');
				$content_in.removeAttr('style');
				done();
			});
		};
		var new_video = $content_in.data('video');
		var video_promise = null;
		if (new_video && new_video.length > 0) {
			video_promise = mediaBOOM.video_manager.transitionTo(new_video);
			video_promise.done(after_video);
		} else {
			mediaBOOM.loader.end(after_video);
		}
	});
};

var slideTransitionInOut = function($container, $content_out, $content_in, done) {
	var out_height = $content_out.height(),
		in_height = $content_in.height(),
		speed = 1000;

	var window_height = $(window).height();
	out_height = out_height > window_height ? out_height : window_height;
	in_height = in_height > window_height ? in_height : window_height;


	var new_video = $content_in.data('video');
	if (new_video && new_video.length > 0) {
		setTimeout(function() {
			mediaBOOM.video_manager.transitionTo(new_video);
		}, 2000);
	}

	$container.css({
		height: out_height,
		overflow: 'hidden',
		width: '100%',
		position: 'relative'
	});

	$content_out.css({
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'right': 0,
		'-webkit-transform': 'translate3d(0%, 0, 0)',
		'-webkit-filter': 'grayscale(0%)',
		'-webkit-transition': '-webkit-transform .5s ease-in-out .25s, -webkit-filter .25s ease-in-out 0s'
	});

	$content_in.css({
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'right': 0,
		'-webkit-transform': 'translate3d(100%, 0, 0)',
		'-webkit-filter': 'grayscale(100%)'
	});

	setTimeout(function() {
		$content_out.css({
			'-webkit-transform': 'translate3d(-100%,0,0)',
			'-webkit-filter': 'grayscale(100%)'
		}, speed - 1);

		$content_in.css({
			'-webkit-transform': 'translate3d(0%,0,0)',
			'-webkit-filter': 'grayscale(0%)',
			'-webkit-transition': '-webkit-transform .5s ease-in-out .25s, -webkit-filter .25s ease-in-out .75s'
		}, speed - 1);
	}, 1);

	$container.animate({
		'height': in_height
	}, speed, function() {
		$container.removeAttr('style');
		$content_in.removeAttr('style');
		done();
	});
};

mediaBOOM.pageTransitionOutIn = fadeTransitionInOut; // slideTransitionInOut // fadeTransitionInOut

var $window = $(window);
var stopAffix = function($el) {
	$el.data('affix', false);
	$window.off('scroll.affix.data-api click.affix.data-api');
};



mediaBOOM.addInteractivity({
	id: 'affix',
	sel: '[data-spy="affix"]',
	onPageLoad: function($el, next) {
		//var affix_offset = $el.data('affix-offset');
		//affix_offset = typeof affix_offset !== 'undefined' ? parseInt(affix_offset, 10) : 270;

		var $globalhead = $('#globalhead');
		var defineAffixes = function() {
			stopAffix($el);
			var top_offset = $globalhead.css('position') === 'fixed' ? 0 : 101;
			$el.affix({
				offset: {
					top: top_offset,
					bottom: 270
				}
			});
		};

		// listen for resize to switch offset
		$window.on('resize', defineAffixes);

		defineAffixes();
	},
	onPageUnload: function($el, next) {
		stopAffix($el);
		next();
	}
});

mediaBOOM.addInteractivity({
	id: 'carousels',
	sel: '.carousel',
	onPageLoad: function($el, next) {
		var $carousel = $el,
			$slider = $carousel.find('.ios-slider'),
			$slides = $slider.find('.item');

		var slideChange = function(args) {
			$slider.find('.active').removeClass('active');
			args.currentSlideObject.addClass('active');
		};

		var transitionOutInnerObjects = function($slide) {
			$slide.find('.text1, .text2').attr('style', '');
		};

		var transitionInInnerObjects = function($slide) {
			$slide.find('.text1').animate({
				right: '100px',
				opacity: '0.8'
			}, 400, 'easeOutQuint');
			$slide.find('.text2').delay(200).animate({
				right: '50px',
				opacity: '0.8'
			}, 400, 'easeOutQuint');
		};

		var slideComplete = function(args) {
			if (!args.slideChanged) return false;
		};

		var sliderLoaded = function(args) {
			slideChange(args);
		};

		$slider.addClass('loaded');
		$slider.iosSlider({
			desktopClickDrag: true,
			snapToChildren: true,
			snapSlideCenter: true,
			infiniteSlider: true,

			navSlideSelector: '.slider-container .slide-selectors .item',
			onSlideComplete: slideComplete,
			onSliderLoaded: sliderLoaded,
			onSlideChange: slideChange,

			autoSlide: true,
			autoSlideTimer: 3200,
			startAtSlide: 1,
			responsiveSlides: true,
			keyboardControls: true,

			stageCSS: {
				overflow: 'visible'
			}
		});

		//$slider.iosSlider('goToSlide', 1);

		next();
	},
	onPageUnload: function($el, next) {
		var $slider = $el.find('.ios-slider');
		$slider.iosSlider('destroy');
		$slider.remove();
		$el.remove();
		next();
	}
});

mediaBOOM.addInteractivity({
	id: 'reflective-globalnav',
	sel: $('#globalnav'),
	onPageLoad: function($globalnav, next) {
		var url = mediaBOOM.ajaxify.history().getState().url;
		url = encodeURI(url.substring(url.lastIndexOf('index.html') + 1));
		url = encodeURI(url);
		$globalnav.find('.active').removeClass('active');

		var $buttons = $globalnav.find('a');
		$buttons.each(function(i, el) {
			var $el = $(el);
			if (document.location.href.indexOf($el.attr("href")) != -1) {
				$el.parent().addClass('active');
				$el.parent().parent().closest('li').addClass('active');
			}
		});

		next();
	},
	onPageUnload: function($globalnav) {}
});


mediaBOOM.addInteractivity({
	id: 'fullscreen-video',
	sel: '.full-video',
	onPageLoad: function($video_container, next) {
		var url = $video_container.data('video'),
			$window = $(window);

		if (url) {
			var playVideo = function() {
				$video_container.data('previous_video', mediaBOOM.video_manager.current_video);
				mediaBOOM.video_manager.playVideo(url, true, false);

				$window.unbind("MBcontentLoad", playVideo);
				mediaBOOM.$content_container.transition({
					opacity: 0
				}, 500, function() {
					mediaBOOM.$content_container.css('display', 'none');
				});

				var revertVideo = function() {
					mediaBOOM.$content_container.css('display', 'block');
					mediaBOOM.$content_container.transition({
						opacity: 1
					}, 500);

					mediaBOOM.video_manager.playVideo($video_container.data('previous_video'), true, true);
					$video_container.removeData('previous_video');
					$(window).unbind("MBcontentUnload", revertVideo);
				};

				$(window).bind("MBcontentUnload", revertVideo);
			};
			$window.bind("MBcontentLoad", playVideo);
		}

		next();
	},
	onPageUnload: function($el, next) {
		mediaBOOM.$content_container.css('display', 'block');
		mediaBOOM.$content_container.transition({
			opacity : 1
		}, 500);

		next();
	}
});


(function() {
	var initHotspot = function(svg_doc, $base_anchor) {
		if(svg_doc === null) {
			return null;
		}

		var $hotspot = $(svg_doc.getElementById('main-image'));
		$hotspot.bind('click', function(evt) {
			MbAjaxify.overrideClick(evt, $base_anchor.get(0));
			return false;
		});
		return $hotspot;
	};

	var passThroughSvgClicks = function($el, next) {
		var $embed = $el,
			embed = $embed.get(0),
			svg_doc = null,
			$hotspot = {
				attr: function() {}
			},
			$base_anchor = $embed.closest('a');
		// init doc
		try {
			svg_doc = embed.getSVGDocument();
		} catch (e) {}
		if (svg_doc !== null && typeof svg_doc !== "undefined") {
			$hotspot = initHotspot(svg_doc, $base_anchor);
		} else {
			$embed.parent().css('opacity', 0.01);
			embed.onload = function() {
				svg_doc = embed.getSVGDocument();
				$hotspot = initHotspot(svg_doc, $base_anchor);
				$embed.parent().animate({
					'opacity': 1
				}, 500);
			};
		}

		/*if($hotspot !== null) {
			$base_anchor.hover(function() {
				$hotspot.attr('class', 'hover');
			}, function() {
				$hotspot.attr('class', '');
			});
		}
*/
		if (typeof next === 'function') {
			next();
		}
	};

	var stopPassThroughSvgClicks = function($el, next) {
		try {
			var embed = $el.get(0),
				svg_doc = embed.getSVGDocument();
			$(svg_doc.getElementById('main-image')).unbind();
			$el = $base_anchor = null;
		} catch (e) {}
	};

	if (Modernizr.inlinesvg) {
		mediaBOOM.addInteractivity({
			id: 'svg-hovers',
			sel: 'embed[type="image/svg+xml"]',
			onPageLoad: passThroughSvgClicks,
			onPageUnload: stopPassThroughSvgClicks
		});
	}

	mediaBOOM.init(function() {
		var $globalnav = $('#globalnav'),
			$globalhead = $('#globalhead'),
			$skipIntroBtn = $("#skip-intro-button"),
			isTouchDevice = $("html").hasClass("touch"),
			isSlowBrowser = (function() {
				if (window.location.hash === '#no-video') {
					return true;
				}
				// todo, write test on browser to determine whether we should downgrade experience
				return !Modernizr.svgicons;
			})();

		var enableNav = function() {
			$globalnav.removeClass("disabled");
		};

		$globalhead.find('#logo, #socialnav, #globalnav').bind('click', function(evt) {
			if (evt.target.tagName === 'A' && (!evt.target.getAttribute("class") || evt.target.getAttribute("class").indexOf("no-ajaxy") === -1)) {

				$skipIntroBtn.css("visibility", "hidden");
				setTimeout(enableNav, 750);
				// emulate navigation to first child if parent is clicked
				var children = $(evt.target).parent('li').find('ul a');
				if (children.length > 0) {
					// show subnav
					if (isTouchDevice) {
						$(evt.target).parent().addClass('hover');
						return false;
					}
					MbAjaxify.overrideClick(evt, children[0]);
				} else {
					MbAjaxify.overrideClick(evt, evt.target);
					$(evt.target).parent().parent().parent().removeClass('hover');
				}
			}

			if (!evt.target.getAttribute("class") || evt.target.getAttribute("class").indexOf("no-ajaxy") === -1)
				return false;
		});

		$('header').find('a[title]').removeAttr("title");

		var $logo = $('#logo embed');
		if (Modernizr.svgicons) {
			passThroughSvgClicks($logo);

			var $socialnav = $('#socialnav a embed').each(function (i, el) {
				passThroughSvgClicks($(el));
			});
		}

		// set up videos
		var video_backgrounds = (isTouchDevice || isSlowBrowser) ? false : true;
		mediaBOOM.video_manager = video_backgrounds ? new MbVideoManager() : new MbBgManager();
		mediaBOOM.video_manager.init(mediaBOOM);

		// do the intro thing
		var hideSkipIntro = function() {
			$skipIntroBtn.transition({
				opacity: 0
			}, 500, function() {
				$skipIntroBtn.remove();
			});
			$(window).off("MBcontentUnload", hideSkipIntro);
		};

		var showContent = function() {
			hideSkipIntro();

			var $article = $('article.page');
			$article.css("visibility", "visible");
			$article.transition({
				opacity: 1
			}, function() {
				$('body').removeClass('fouc'); // fouc you
			});
		};

		$(window).on("MBcontentUnload", hideSkipIntro);

		// touchDevice 3D handling
		if (document.location.pathname === "/" && document.location.hash === "#3D" && isTouchDevice) {
			if ( typeof window._gaq !== 'undefined' ) {
				window._gaq.push(['_trackPageview', "/3D"]);
			}
			//window.location.hash = "";
			setTimeout(function () {
				document.location.pathname = "portfolio/3d-reel/index.html";
			}, 200);

			return;
		}

		// do we play the intro video?
		if (document.location.pathname === "/" &&
			(document.location.hash === "" || document.location.hash === "#3D") && !isTouchDevice && document.location.hash !== "#skip" && !isSlowBrowser) {

			var video_promise;

			mediaBOOM.loader.start();

			// 3d reel?
			if (document.location.hash === "#3D") {
				if ( typeof window._gaq !== 'undefined' ) {
					window._gaq.push(['_trackPageview', "/3D"]);
				}
				video_promise = mediaBOOM.video_manager.intro(true);
			} else {
				$skipIntroBtn.delay(1000).css("visibility", "visible");
				$skipIntroBtn.delay(1000).transition({
					opacity: 1
				});
				video_promise = mediaBOOM.video_manager.intro(false);
			}

			video_promise.done(function() {
				showContent();
			});
		} else {
			// jump right in

			// start video
			mediaBOOM.video_manager.transitionTo(mediaBOOM.$content.data('video'));
			showContent();
		}
	});
})();


// kick off any loaded events waiting for our pseudo document ready event
$(document).ready(function() {
	$(window).trigger("MBcontentLoad");


	var menu = $('#main-nav'),
		menuTrigger = $('#globalnav-trigger'),
		menuItems = menu.find('a');

	menuTrigger.click(function(e){
		e.preventDefault();

		var t = $(this);
		menu.toggle();
		menuTrigger.toggleClass('opened');
	});


	menuItems.click(function(e){
		e.preventDefault();

		menu.toggle();
		menuTrigger.toggleClass('opened');

	});

});