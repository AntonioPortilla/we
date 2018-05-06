
// debugger;
var MbAjaxify = (function(window, undefined) {
	// debugger;
	var History = window.History;
	if (typeof History === "undefined" || !History.enabled) {
		return false;
	}


	var $ = window.jQuery,
		document = window.document;
	contentSelector = '.page,article:first,.article:first,.post:first',
	$content = $(contentSelector).filter(':first'),
	contentNode = $content.get(0),
	$menu = $('#menu,#nav,nav:first,.nav:first').filter(':first'),
	activeClass = 'active selected current youarehere',
	activeSelector = '.active,.selected,.current,.youarehere',
	menuChildrenSelector = '> li,> ul > li',
	completedEventName = 'statechangecomplete',
	/* Application Generic Variables */
	$window = $(window),
	$body = $(document.body),
	rootUrl = History.getRootUrl(),
	scrollOptions = {
		duration: 800,
		easing: 'swing'
	};



	$.fn.ajaxify = function() {
		// Prepare
		var $this = $(this);

		// Ajaxify
		$this.find('a:internal:not(.no-ajaxy)').click(MbAjaxify.overrideClick);

		// Chain
		return $this;
	};

	function MbAjaxify() {
		this.init();
	}

	MbAjaxify.overrideClick = function(event, target) {
		var $this = $(target || this),
			url = $this.attr('href'),
			title = $this.attr('title') || null;

		if($this.attr('target') === '_blank') {
			window.open(url, '_blank');
			return false;
		}

		// special case for subnavs - should be refactored in to interactivities?
		if ($this.hasClass("side-nav-link")) {
			$(".side-nav a").removeClass("side-nav-selected");
			$this.addClass("side-nav-selected");
		}

		// Continue as normal for cmd clicks etc
		if (event.which == 2 || event.metaKey) {
			return true;
		}

		if (url == "#") return false; // js widgets

		// Ajaxify this link
		History.pushState(null, title, url);
		event.preventDefault();
		return false;
	};

	MbAjaxify.prototype.init = function() {
		if ($content.length === 0) {
			$content = $body;
		}

		$.expr[':'].internal = function(obj, index, meta, stack) {
			var $this = $(obj),
				url = $this.attr('href') || '',
				isInternalLink;

			isInternalLink = url.substring(0, rootUrl.length) === rootUrl || url.indexOf(':') === -1;

			return isInternalLink;
		};
	};

	MbAjaxify.prototype.getPage = function(url, cbk) {
		$.ajax({
			url: url,
			success: function(data, textStatus, jqXHR) {
				cbk(null, data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				cbk(errorThrown, null);

			}
		}); // end ajax


	};

	MbAjaxify.prototype.processPage = function() {

	};

	MbAjaxify.prototype.ajaxify = function($el) {
		$el.ajaxify();
	};

	MbAjaxify.prototype.history = function() {
		return History;
	};

	MbAjaxify.prototype.onUrlChange = function(cbk) {
		// Hook into State Changes		
		$window.bind('statechange', function() {
			// Prepare Variables
			var State = History.getState(),
				url = State.url,
				relativeUrl = url.replace(rootUrl, '');

			if (typeof window._gaq !== 'undefined' && document.location.hash.toLowerCase() !== '#3d') {				
				window._gaq.push(['_trackPageview', '/' + relativeUrl]);
			}

			return cbk(url, relativeUrl);
		}); // end onStateChange
	};

	return MbAjaxify;
})(window); // end closure