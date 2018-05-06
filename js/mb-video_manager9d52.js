function MbVideoManager() {
	this.mediaBOOM = null;
	this.$wrapper_1 = null;
	this.$wrapper_2 = null;
	this.current_video = null;
	this.BV_1 = null;
	this.BV_2 = null;
	this.player_1 = null;
	this.$player_el_1 = null;
	this.$vid_el_1 = null;
	this.player_2 = null;
	this.$player_el_2 = null;
	this.$vid_el_2 = null;
	this.playing_intro = false;

	this.$active_wrapper = null;
	this.$inactive_wrapper = null;
	this.active_bv = null;
	this.inactive_bv = null;

	this.started = false;

	this.canvas = null;
	this.ctx = null;
	this.vendor_prefix = null;

	this.main_nav = null;
	this.previous_nav_item = null;

	this.ambient = true;

	this.home_video_url = "http://www.weaycsac.com/video/consultoria.mp4";
	this.intro_video_url = "http://www.weaycsac.com/video/consultoria.mp4";
	this.reel_video_url = "http://www.weaycsac.com/video/consultoria.mp4";

	this.deferred = new $.Deferred();
}

MbVideoManager.prototype.init = function(mbSite) {
	var video_screens = $('.page[data-video^="video"]'),
		$screen = $(video_screens.get(0)),
		$window = $(window),
		self = this;

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	if (window.requestFileSystem) {
		window.requestFileSystem(window.PERSISTENT, 20 * 1024 * 1024, function(result) {
			// video cache
		}, function(err) {
			// no video cache
		});
	}

	// cache reference to site object
	this.mediaBOOM = mbSite;

	//!Modernizr.touch
	// this.canvas = document.createElement('canvas');
	// this.ctx = this.canvas.getContext('2d');

	// initialize player 1
	this.BV_1 = new $.BigVideo({
		forceAutoplay: Modernizr.touch,
		wrap: $('<div id="big-video-wrap-1" class="big-video-wrap"></div>'),
		vidEl: "#big-video-vid-1",
		useFlashForFirefox:false,
		controls: true
	});
	this.BV_1.init();

	this.player_1 = this.BV_1.getPlayer();
	this.$player_el_1 = $(this.player_1.el);
	this.$vid_el_1 = $(this.$player_el_1.find('video').get(0));
	this.$wrapper_1 = $('#big-video-wrap-1');
	this.$wrapper_1.css('opacity', 0);

	this.BV_1.getPlayer().on('loadeddata', function() {
		self.onVideoLoaded(self.BV_1);
	});

	this.left_field = Modernizr.csstransitions ? 'left' : '-webkit-transform';
	this.vendor_prefix = (function() {
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('')
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	})();

	this.main_nav = $('#main-nav');
	this.previous_nav_item = this.getActiveNavElement();
	$(window).bind("MBcontentLoad", function() {
		self.previous_nav_item = self.getActiveNavElement();
	});


	// initialize player 2
	this.BV_2 = new $.BigVideo({
		forceAutoplay: Modernizr.touch,
		wrap: $('<div id="big-video-wrap-2" class="big-video-wrap"></div>'),
		vidEl: "#big-video-vid-2",
		useFlashForFirefox:false,
		controls: true
	});
	this.BV_2.init();

	this.player_2 = this.BV_2.getPlayer();
	this.$player_el_2 = $(this.player_2.el);
	this.$vid_el_2 = $(this.$player_el_2.find('video').get(0));
	this.$wrapper_2 = $('#big-video-wrap-2');
	this.$wrapper_2.css('opacity', 0);

	this.BV_2.getPlayer().on('loadeddata', function() {
		self.onVideoLoaded(self.BV_2);
	});

	// start with BV1
	this.$active_wrapper = this.$wrapper_1;
	this.active_bv = this.BV_1;
	this.$inactive_wrapper = this.$wrapper_2;
	this.inactive_bv = this.BV_2;

	// hide both player controls
	$('.big-video-control-container').css('opacity', 0);
};

MbVideoManager.prototype.transitionTo = function(video_url) {

	if (this.playing_intro) {
		this.playing_intro = false;
		this.inactive_bv.getPlayer().off("ended", this.transitionToHomeVideo); // shouldn't be necessary
		this.active_bv.getPlayer().off("ended", this.transitionToHomeVideo);
		$('body').removeClass('fouc'); // TODO: refactor into main.js
	}

	delete this.deferred;
	this.deferred = $.Deferred();
	var self = this;
	if (this.current_video === video_url) {
		this.mediaBOOM.loader.end(function() {
			self.deferred.resolve(); // resolve immediately
		});
		return this.deferred.promise();
	}

	this.playVideo(video_url);
	return this.deferred.promise();

};

MbVideoManager.altSource = function(source, ext) {
	return source.substring(0, source.lastIndexOf('.') + 1) + ext;
};

MbVideoManager.prototype.playVideo = function(video, current, ambient) {
	var self = this;

	video = typeof video === 'object' ? video.attr('data-video') : video;
	if (typeof video !== 'string' || video.length === 0) {
		return;
	}
	this.current_video = video;
	current = typeof current === 'boolean' ? current : false;
	ambient = typeof ambient === 'boolean' ? ambient : true;

	if(current) {
		// show active player controls
		this.ambient = false;

		var playActive = function () {
			self.$active_wrapper.transition({
				opacity : 0
			}, 500, function () {
				// load into the inactive player
				self.active_bv.show(self.current_video, {
					altSource : MbVideoManager.altSource(video, 'ogv'),
					ambient: ambient
				});

				if(!ambient) {
					self.$active_wrapper.find('.big-video-control-container').css('display', 'block');
					self.$active_wrapper.find('.big-video-control-container').transition({
						'opacity' : 1
					}, 500);
				}

				self.$active_wrapper.transition({
					opacity : 1
				}, 500);
			});
		};

		setTimeout(function () {
			playActive();
		}, 500);

	} else {
		this.ambient = true;

		// hide all
		$('.big-video-control-container').transition({
			'opacity': 0
		}, 500, function() {
			self.$inactive_wrapper.find('.big-video-control-container').css('display', 'none');
		});

		// load into the inactive player
		this.inactive_bv.show(this.current_video, {
			altSource : MbVideoManager.altSource(video, 'ogv'),
			ambient: ambient
		});
	}
};

MbVideoManager.prototype.swapActivePlayer = function() {
	var tmp_bv = this.active_bv;
	var $tmp_wrap = this.$active_wrapper;
	this.active_bv = this.inactive_bv;
	this.$active_wrapper = this.$inactive_wrapper;
	this.inactive_bv = tmp_bv;
	this.$inactive_wrapper = $tmp_wrap;

	this.$active_wrapper.css('z-index', 2);
	this.$inactive_wrapper.css('z-index', 1);
};

MbVideoManager.prototype.determineVideoDirection = function() {
	var previous_btn_position = $(this.previous_nav_item).position(),
		next_btn_position = $(this.getActiveNavElement()).position();

	return previous_btn_position.left >= next_btn_position.left ? -1 : 1;
};

MbVideoManager.prototype.optimizedCss = function(css) {
	var direction = 1; //this.determineVideoDirection();

	var value = '';
	for (var field in css) {
		if (field === 'left') {
			css[field] = (parseInt(css[field], 10) * direction) + '%';
		}

		if (field === 'left' && Modernizr.csstransforms) {
			value = 'translate3d(' + css[field] + ',0,0)';
			field = this.vendor_prefix.css + 'transform';
			css[field] = value;
			delete css['left'];
		}
	}
	return css;
};

MbVideoManager.prototype.onVideoLoaded = function(bv) {

	// the firefox flash fallback triggers spurious invocations
	// of this event handler on loop; ignore them
	if (bv == this.active_bv)
		return;

	var self = this;

	this.mediaBOOM.loader.end(function() {
		if (self.started === false) {
			self.$inactive_wrapper.transition({
				opacity: 1
			}, 500);
			self.$active_wrapper.css(self.optimizedCss({
				opacity: 1,
				left: '100%'
			}));
			self.swapActivePlayer();
			self.started = true;
			if (!self.playing_intro) {
				// if we're playing the intro, don't resolve and show content immediately;
				// instead, play the video first
				self.deferred.resolve();
			}
		} else {
			// the inactive player contains the loaded video
			self.active_bv.getPlayer().pause();
			self.inactive_bv.getPlayer().pause();
			// different behavior depending upon whether we're playing the intro or not
			if (self.playing_intro) {
				self.$active_wrapper.transition({
					opacity: 0
				}, 1000);
				self.$inactive_wrapper.css(self.optimizedCss({
					"left": "0%",
					"opacity": 0
				}));
				self.$inactive_wrapper.transition({
					opacity: 1
				}, 1000);
				self.inactive_bv.getPlayer().play();
			} else {
				self.$active_wrapper.transition(self.optimizedCss({
					left: "-100%"
				}), 1000);
				self.$inactive_wrapper.css("opacity", 1);
				self.$inactive_wrapper.transition(self.optimizedCss({
					left: "0%"
				}), 1000);
			}

			self.$inactive_wrapper.promise().done(function() {
				self.swapActivePlayer();
				self.$inactive_wrapper.css(self.optimizedCss({
					"left": "100%"
				}));
				self.active_bv.getPlayer().play();
				self.deferred.resolve();
			});
		}
	});

};

MbVideoManager.prototype.transitionToHomeVideo = function() {
	this.inactive_bv.getPlayer().off("ended", this.transitionToHomeVideo);
	this.playVideo(this.home_video_url);
};

MbVideoManager.prototype.intro = function(video) {
	this.playing_intro = true;
	this.deferred = $.Deferred();
	var video_url = null;
	if(typeof video === 'string') {
		video_url = video;
	} else {
		video_url = video ? this.reel_video_url : this.intro_video_url;
	}
	this.current_video = video_url;
	this.inactive_bv.show(video_url, {
		altSource: MbVideoManager.altSource(video_url, 'ogv')
	});
	this.transitionToHomeVideo = this.transitionToHomeVideo.bind(this);
	this.inactive_bv.getPlayer().on("ended", this.transitionToHomeVideo);
	return this.deferred.promise();
};

MbVideoManager.prototype.getActiveNavElement = function() {
	return $(this.main_nav.children('.active').find('a')[0]);
};


// ipad / mobile device specialization

function MbBgManager() {
	this.$bg_1 = null;
	this.$bg_2 = null;
	this.current_image = null;
	this.$active_bg = null;
	this.$inactive_bg = null;
	this.deferred = new $.Deferred();
	this.started = false;
	this.mediaBOOM = null;
}

MbBgManager.prototype.init = function(mbSite) {
	this.$bg_1 = $("<div id='touch-bg-1' class='touch-bg'></div>");
	this.$bg_2 = $("<div id='touch-bg-2' class='touch-bg'></div>");

	$('body').prepend(this.$bg_1);
	$('body').prepend(this.$bg_2);

	// cache
	this.mediaBOOM = mbSite;

	// start with BV1
	this.$active_bg = this.$bg_1;
	this.$inactive_bg = this.$bg_2;
};

MbBgManager.prototype.transitionTo = function(image_url) {

	delete this.deferred;
	this.deferred = $.Deferred();

	// TODO: fix this hack
	image_url = image_url.replace("video", "img").replace("mp4", "jpg");
	var self = this;
	if (this.current_image === image_url) {
		this.mediaBOOM.loader.end(function() {
			self.deferred.resolve(); // resolve immediately
		})
		return this.deferred.promise();
	}

	this.mediaBOOM.loader.end(function() {
		self.showImage(image_url);
	});
	return this.deferred.promise();

};

MbBgManager.prototype.showImage = function(image) {
	image = typeof image === 'object' ? image.attr('data-image') : image;
	if (typeof image !== 'string' || image.length === 0) {
		return;
	}
	this.current_image = image;

	// load the image
	var self = this;
	var deferredLoad = $.loadImage(image);
	deferredLoad.done(function() {
		// set as bg of inactive bg holder
		self.$inactive_bg.css("background-image", "url(" + image + ")");
		self.animateTransition();
	});
};


MbBgManager.prototype.swapActivePlayer = function() {
	var $tmp_bg = this.$active_bg;
	this.$active_bg = this.$inactive_bg;
	this.$inactive_bg = $tmp_bg;
};

MbBgManager.prototype.animateTransition = function() {

	if (this.started === false) {
		this.$inactive_bg.transition({
			opacity: 1
		}, 500);
		this.$active_bg.css({
			opacity: 1,
			left: "100%"
		});
		this.swapActivePlayer();
		this.started = true;
		this.deferred.resolve();
	} else {
		this.$active_bg.transition({
			left: "-100%"
		}, 1000);
		this.$inactive_bg.css("opacity", 1);
		this.$inactive_bg.transition({
			left: "0%"
		}, 1000);
		var self = this;
		this.$inactive_bg.promise().done(function() {
			self.swapActivePlayer();
			self.$inactive_bg.css("left", "100%");
			self.deferred.resolve();
		});
	}

};
