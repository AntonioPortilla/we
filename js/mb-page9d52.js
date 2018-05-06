var MbPage = (function () {
	var documentHtml = function(html){
		var result = String(html)
			.replace(/<\!DOCTYPE[^>]*>/i, '')
			.replace(/<(html|head|body|title|meta|script)([\s\>])/gi,'<div class="document-$1"$2')
			.replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
		;

		return $.trim(result);
	};

	function MbPage (data) {
		this.slug = '';
		this.url = '';
		this.title = '';
		this.stylesheets = [];
		this.scripts = [];
		this.section = '';
		this.layout = '';
		this.content = '';

		this.initFromHtml(data);
	}

	MbPage.prototype.loadScriptSync = function(src) {
		$.ajax({
			async : false,
			url : src,
			dataType : "script"
		});
	}

	MbPage.prototype.initFromHtml = function (data) {
		var $data = $(documentHtml(data)),
			$dataBody = $data.find('.document-body:first'),
			$dataContent = $dataBody.find(contentSelector).filter(':first'),
			$menuChildren, contentHtml, $scripts;
		// debugger;
		this.title = $data.find('.document-title:first').text();

		// Fetch the scripts
		this.$scripts = $dataContent.find('.document-script');
		if (this.$scripts.length) {
			this.$scripts.detach();
		}

		this.content = $dataContent;

		// add script functionality back in, loading external scripts
		// if necessary and executing inline scripts immediately
		// XXX: should this be worked into the
		// MediaBoomSite.interactivities framework?
		var self = this;
		this.$scripts.each(function(){
			var $script = $(this),
				scriptText = $script.text(),
				scriptSrc = $script.attr("src");
				scriptNode = document.createElement('script');
			if (typeof scriptSrc !== "undefined") {
				self.loadScriptSync(scriptSrc);
			} else {
				scriptNode.appendChild(document.createTextNode(scriptText));
				contentNode.appendChild(scriptNode);
			}
		});
	};

	return MbPage;
})();