function initLoader($loader_el) {
	this.frame_count = 5; // number of frames - 1
	this.el = $loader_el;
	this.speed = 25;
	this.width = $loader_el.width();
	this.current_frame = 0;
	this.timeout = null;
	this.visible = false;
	this.should_start = false;
	this.onComplete = function () {};
}

initLoader.prototype.start = function () {
	var self = this;

	this.should_start = true;
	setTimeout(function () {
		if(self.should_start === true) {
			self.showLoader();
		}
	}, 2000);
};

initLoader.prototype.showLoader = function () {
	this.current_frame = 0;
	this.timeout = setInterval(this.nextFrame.bind(this), this.speed);
	this.el.css("visibility", "visible");
	this.el.transition({ opacity: 1 }, function () { });
};

initLoader.prototype.end = function (callback) {
	var self = this;
	var done = function () {
		if(typeof callback === 'function') {
			callback();
		}
	};

	this.should_start = false;
	if(this.el.css("visibility") === 'visible') {
		self.el.transition({ opacity: 0 }, function () {
			clearInterval(self.timeout);
			self.el.css("visibility", "hidden");
			done();
		});
	} else {
		done();
	}
};

initLoader.prototype.nextFrame = function () {
	this.current_frame++;
	if (this.current_frame > this.frame_count) {
		this.current_frame = 0;
	}
	this.showFrame(this.current_frame);
};

initLoader.prototype.prevFrame = function () {
	this.current_frame--;
	this.showFrame(this.current_frame);
};

initLoader.prototype.showFrame = function (frame_number) {
	this.el.attr('data-frame', frame_number);
	this.el.css('background-position', -1 * frame_number * this.width);
	// debugger;
	if(frame_number === this.frame_count) {
		this.onComplete();
	}
};