var noodle = require('../');
var assert = require('assert');

var noodlesware;


var buildCounter = function() {
	var ee = function(cb) {
		ee.counter++;
		ee.date = +new Date();
		cb(null);
	}
	ee.counter = 0;
	return ee;
}

var timer = function(cb) {
	setTimeout(function() {
		cb(null);
	}, 5);
};

var first, second;



describe("calling emit for an event", function() {


	beforeEach(function() {
		noodlesware = new noodle();
		first = buildCounter();
		second = buildCounter();

	});

	describe("when nothing is registered", function() {
		it("doesnt execute anything", function(next) {
			noodlesware.emit('toto');
			assert.equal(0, first.counter);
			next();
		})
	});

	describe("when a callback is registered", function() {
		it("it runs one time ", function(next) {
			noodlesware.use('toto', first)
			noodlesware.emit('toto');
			setTimeout(function() {
				assert.equal(1, first.counter);
				next();
			}, 5)
		});
	})

	describe("when two callback are registered", function() {
		it("both are called", function(next) {

			noodlesware.use('toto', first)
			noodlesware.use('toto', second)

			assert.equal(0, first.counter);
			assert.equal(0, second.counter);


			noodlesware.emit('toto');
			setTimeout(function() {
				assert.equal(1, first.counter);
				assert.equal(1, second.counter);
				next();
			}, 5)
		});
	})

	describe("when callbacks are registered", function() {
		it("they are called in the good order", function(next) {

			noodlesware.use('toto', first);
			noodlesware.use('toto', timer);
			noodlesware.use('toto', second);

			assert.equal(0, first.counter);
			assert.equal(0, second.counter);


			noodlesware.emit('toto');
			setTimeout(function() {
				assert.equal(1, first.counter);
				assert.equal(1, second.counter);
				assert.ok(second.date > first.date);
				next();
			}, 15)
		});
	})


	describe("when two callback are registered on different topic", function() {
		it("both are called ", function(next) {

			noodlesware.use('tutu', first)
			noodlesware.use('tata', second)

			assert.equal(0, first.counter);
			assert.equal(0, second.counter);


			noodlesware.emit('tata');
			setTimeout(function() {
				assert.equal(0, first.counter);
				assert.equal(1, second.counter);

				next();
			}, 5)
		});
	})



	describe("when one cb ir registered on several topic", function() {
		it("topic is called", function(next) {

			noodlesware.use('tutu toto tata', first)

			assert.equal(0, first.counter);

			noodlesware.emit('tata');
			setTimeout(function() {
				assert.equal(1, first.counter);

				next();
			}, 5)
		});
	})


});