var Event = require('events').EventEmitter,
	async = require('async');

module.exports = function noodlesware() {
	if (!(this instanceof noodlesware)) return new noodlesware();

	var ee = new Event();

	var registered = {};

	var toReturn = {

		use: function(event, cb) {
			registered[event] = (registered[event] || []).concat(cb);
				
			if (registered[event].length === 1) {
				//first event
				ee.on(event, function() {
					if (registered[event]){
						async.waterfall(registered[event], function(){ });
					}
				})
			}
		}
	};

	toReturn.emit = ee.emit.bind(ee);

	return toReturn;
};