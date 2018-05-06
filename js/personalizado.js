var MediaBoomSite = (function($, undefined) {
	"use strict";

	var emptyFunction = function() {},
		blank_str = '',
		default_interactivity = {
			id: blank_str,
			sel: blank_str,
			onPageLoad: emptyFunction,
			onPageUnload: emptyFunction
		};

	function MbSiteInteractivity(params) {
		this.id = params.id;
		this.sel = params.sel;
		this.doOnPageLoad = params.onPageLoad;
		this.doOnPageUnload = params.onPageUnload;
		this.$el = null;
	}

	MbSiteInteractivity.prototype.onPageLoad = function($content) {
		var self = this;
		this.$el = typeof this.sel === 'string' ? $content.find(this.sel) : this.sel;
		this.$el.each(function() {
			self.doOnPageLoad($(this), emptyFunction);
		});
	};

	MbSiteInteractivity.prototype.onPageUnload = function($content) {
		var self = this;
		this.$el = typeof this.sel === 'string' ? $content.find(this.sel) : this.sel;
		this.$el.each(function() {
			self.doOnPageUnload($(this), emptyFunction);
		});
	};

	function MediaBoomSite() {
		this.section = '';
		this.layout = '';
		this.interactivities = {};
		this.cache = null;
		this.ajaxify = null;

		this.pageTransitionOutIn = null;
		this.change_page_queue = [];
		this.changing_page = false;

		this.$header = null;
		this.$global_nav = null;
		this.$aside = null;
		this.$logo = null;
		this.$content_container = null;
		this.$content = null;
		this.loader = null;
	}

	MediaBoomSite.prototype.init = function(cbk) {
		var self = this;

		if (typeof $.browser === 'undefined') {
			$.browser = {};
		}

		this.$header = $('#globalhead');
		this.$global_nav = $('#globalnav');
		this.$content_container = $('#content');
		this.$content = this.$content_container.children('article:first');
		this.loader = new initLoader($("#loader"));

		var cachetype = 'memory'; //$('.page.admin-bar').length > 0 ? 'memory' : 'localstorage';

		this.cache = new MbCache(cachetype); // memory / localstorage
		this.ajaxify = new MbAjaxify();
		this.ajaxify.loader = this.loader;
		this.ajaxify.onUrlChange(function(url, relative_url) {
			self.changePage(url, relative_url);
		});

		this.ajaxify.ajaxify(this.$content_container);

		if (typeof cbk === 'function') {
			cbk(this);
		}

		if (this.section === '') {
			this.onPageLoad(this.$content);
		}
	};

	MediaBoomSite.prototype.pageTransitionIn = function($container, $content_in, done) {
		done();
	};

	MediaBoomSite.prototype.pageTransitionOut = function($container, $content_out, done) {
		done();
	};

	MediaBoomSite.prototype.getPage = function(url, cbk) {
		var self = this;
		var processMbPage = function(err, mb_page_data, cache) {
			cache = typeof cache === 'boolean' ? cache : true;
			var mb_page = new MbPage(mb_page_data);
			if (mb_page) {
				if (cache) {
					self.cache.cachePage(url, mb_page_data);
				}
				mb_page_data = null;
				return cbk(null, mb_page);
			}
			return cbk(err, null);
		};
		var mb_page_data = this.cache.getPage(url);
		if (mb_page_data) {
			processMbPage(null, mb_page_data);
		} else {
			this.ajaxify.getPage(url, processMbPage);
		}
	};

	MediaBoomSite.prototype.beforePageLoad = function() {
		// loaded JS files register for this event and
		// perform any necessary cleanup
		$(window).trigger("MBcontentUnload");
	};

	MediaBoomSite.prototype.afterPageLoad = function() {
		this.changing_page = false;
		if (this.change_page_queue.length > 0) {
			this.changePage(this.change_page_queue.shift());
		} else {
			// simulate a $(document).ready() on any loaded JS
			$(window).trigger("MBcontentLoad");
		}
	};

	MediaBoomSite.prototype.changePage = function(url) {
		var self = this;

		if (this.changing_page === true) {
			this.change_page_queue.push(url);
			return;
		}

		this.loader.start();

		this.changing_page = true;

		self.beforePageLoad();

		self.getPage(url, function(err, mb_page) {
			var $in_page_content = mb_page.content,
				$out_page_content = self.$content,
				speed = 500; // TODO: refactor into main.js

			self.ajaxify.ajaxify($in_page_content);


			// Check what transition strategy to use based on transition type
			// check for portfolio transition
			if ($in_page_content.hasClass("pg-portfolio") &&
				$in_page_content.find("nav.side-nav").length &&
				$out_page_content.hasClass("pg-portfolio") &&
				$out_page_content.find("nav.side-nav").length) {

				self.loader.end(function() {
					var $portfolioContainer = $(".row.portfolio");
					$portfolioContainer.fadeOut(speed);
					$portfolioContainer.promise().done(function() {
						$portfolioContainer.html($in_page_content.find(".row.portfolio").html());
						self.ajaxify.ajaxify($portfolioContainer);
						$portfolioContainer.fadeIn(speed);
						$portfolioContainer.promise().done(function() {
							self.onPageLoad($portfolioContainer);
							self.updatePageTitle(mb_page.title);
							self.afterPageLoad();
						});
					});
				});


				// check for careers transition
				// TODO: refactor with above
			} else
			if ($in_page_content.hasClass("pg-careers") &&
				$in_page_content.find("nav.side-nav").length &&
				$out_page_content.hasClass("pg-careers") &&
				$out_page_content.find("nav.side-nav").length) {

				self.loader.end(function() {
					var $careersContainer = $(".careers-content");
					$careersContainer.fadeOut(speed);
					$careersContainer.promise().done(function() {
						$careersContainer.html($in_page_content.find(".careers-content").html());
						self.ajaxify.ajaxify($careersContainer);
						$careersContainer.fadeIn(speed);
						$careersContainer.promise().done(function() {
							self.onPageLoad($careersContainer);
							self.updatePageTitle(mb_page.title);
							self.afterPageLoad();
						});
					});
				});

			} else {
				// use whatever pageTransitionOutIn strategy was passed in
				self.$content_container.append($in_page_content);
				self.onPageLoad($in_page_content);
				self.pageTransitionOutIn(self.$content_container, $out_page_content, $in_page_content, function() {
					self.onPageUnload($out_page_content);
					$out_page_content.remove();
					self.$content = $in_page_content;
					self.updatePageTitle(mb_page.title);
					self.afterPageLoad();
				});
			}
		});
		return;
	};

	MediaBoomSite.prototype.addInteractivity = function(params) {
		params = $.extend(default_interactivity, params);
		if (!(params.id in this.interactivities)) {
			this.interactivities[params.id] = new MbSiteInteractivity(params);
		}
	};

	MediaBoomSite.prototype.onPageLoad = function($content, cbk) {
		$content = $content === null ? this.$content : $content;

		for (var i in this.interactivities) {
			this.interactivities[i].onPageLoad($content);
		}

		if (typeof cbk === 'function') {
			cbk(this);
		}
	};

	MediaBoomSite.prototype.onPageUnload = function($content, cbk) {
		$content = $content === null ? this.$content : $content;

		for (var i in this.interactivities) {
			this.interactivities[i].onPageUnload($content);
		}

		if (typeof cbk === 'function') {
			cbk(this);
		}
	};

	MediaBoomSite.prototype.updatePageTitle = function(title) {
		document.title = title;
		try {
			document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
		} catch (Exception) {}
	};

	MediaBoomSite.prototype.toString = function() {
		var status = "**mediaBOOM 3.0**\n";
		status += "-----------------\n";
		for (var prop in this) {
			if (typeof this[prop] !== 'function') {
				status += "   " + prop + " > " + this[prop] + "\n";
			}
		}

		return status;
	};

	return MediaBoomSite;
})(jQuery, 'undefined');