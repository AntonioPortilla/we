var MbCache = (function () {

	function MemoryCache () {
		this.items = {};
	}

	MemoryCache.prototype.getItem = function(key) {
		return key in this.items ? this.items[key] : null;
	};

	MemoryCache.prototype.setItem = function(key, value) {
		this.items[key] = value;
	};

	function MbCache(type) {
		type = typeof type === 'undefined' ? ((typeof localStorage === 'object') ? 'localstorage' : 'memory') : type;
		if(type === 'localstorage') {
			this.store = localStorage;
		} else {
			this.store = new MemoryCache();
		}
	}

	MbCache.prototype.getPage = function (url) {
		var loaded_date = new Date();
		var page_data = this.store.getItem(url);

		if(typeof page_data === 'string' && page_data.length > 0) {
			var parts = page_data.split('!!C@CHE$T@RT!!');

			if(parts.length > 1) {
				var last_updated = parts[0],
				page_content = parts[1];

				if(parseInt(last_updated, 10) > (loaded_date - 10000)) {
					return page_content;
				}
			}
		}

		return false;
	};

	MbCache.prototype.cachePage = function(url, mb_page_data) {
		var loaded_date = new Date();

		if(((typeof url === 'string') && url.length > 0)) {
			mb_page_data = loaded_date.getTime() + '!!C@CHE$T@RT!!' + mb_page_data;

			if(url !== null) {
				this.store.setItem(url, mb_page_data);
			}
		}
	};

	return MbCache;
})();