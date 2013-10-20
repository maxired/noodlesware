var Event = require('events').EventEmitter,
	async = require('async');


var PRIORITY = {
	FIRST: 0,
	QUICKLY: 100,
	NORMAL: 500,
	LATE: 2000,
	LATEST: 5000
};

function noodlesware() {
	if (!(this instanceof noodlesware)) return new noodlesware();

	function sortArgs() {
		var args = Array.prototype.slice.call(arguments, 0);
		return args.sort();
	}

	var ee = new Event();

	var registered = {};

	var toReturn = {

		use: function(events, priority, cb) {

				if (!cb) {
				cb = priority;
				priority = PRIORITY.NORMAL;
			}

			var self=this;

			events.split(' ').forEach(function(event) {
				registered[event] = (registered[event] || []).concat({
					priority: priority,
					fct: cb
				});

				if (registered[event].length === 1) {
					//first event
					ee.on(event, function() {
						var args = sortArgs.apply(null, arguments);

						if (registered[event]) {
							async.waterfall(registered[event].sort(function(a, b) {
								return a.priority - b.priority;
							}).map(function(obj) {
								var tmp = function() {
									obj.fct.apply(self, args.concat(sortArgs.apply(null, arguments)));
								}
								return tmp;
							}));
						}
					})
				}
			})
		},
		on: function() {
			ee.on.apply(ee, arguments)
		}
	};

	toReturn.emit = ee.emit.bind(ee);

	return toReturn;
};

noodlesware.PRIORITY = PRIORITY;
	
module.exports = noodlesware;