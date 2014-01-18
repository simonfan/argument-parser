(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'argument-parser',
		// dependencies for the test
		deps = [mod, 'should', 'lodash'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(parser, should, _) {
	'use strict';

	describe('args = parser(arguments)', function () {
		beforeEach(function () {

			this.createArgsObj = function (args) {
				return function () {
					return parser(arguments);
				}.apply(this, args);
			}

		});

		it('initializes', function () {
			var args = this.createArgsObj(['strng', {}]);

			args.should.be.type('object')
		});

		it('stores the original arguments object', function () {
			var args = this.createArgsObj(['str', {}]);

			_.isArguments(args.arguments).should.be.true;
			_.isArray(args.arguments).should.be.false;
		})

		describe('args.acceptsFormat(types, [length])', function () {

			it('supports no-type-nor-count', function () {
				var args = this.createArgsObj(['string', {}, []]);

				args.acceptsFormat()
					.should.be.true;
			});

			it('supports argument-count comparison', function () {
				var args = this.createArgsObj(['string', {}, []]);

				args.acceptsFormat(3)
					.should.be.true;

				args.acceptsFormat(2)
					.should.be.false;

				args.acceptsFormat('>2')
					.should.be.true;

				args.acceptsFormat('<3')
					.should.be.false;
			});

			it('supports basic js native types', function () {

				var args = this.createArgsObj(['string', {}, []]);

				args.acceptsFormat(['string', 'object'])
					.should.be.true;

				args.acceptsFormat(['object'])
					.should.be.false;
			});

			it('also supports all lodash \'is{whatever}\' types', function () {
				var args = this.createArgsObj(['string', {}, []]);

				args.acceptsFormat(['string', 'object', 'array'])
					.should.be.true;
			});

			it('supports multiple types at a single position', function () {
				var args = this.createArgsObj(['string', {}, []]),
					args1 = this.createArgsObj([89, {}, 'string']);

				var format = ['string|number', 'object', 'array|string'];

				args.acceptsFormat(format)
					.should.be.true;

				args1.acceptsFormat(format)
					.should.be.true;
			});

			it('supports negative patterns', function () {
				var args = this.createArgsObj(['string', {}, []]);

				args.acceptsFormat(['!number', '!array', '!string'])
					.should.be.true;
			})

			it('supports length definition', function () {
				var args = this.createArgsObj(['string', {}, []]);

				// length NOT defined
				args.acceptsFormat(['string', 'object'])
					.should.be.true;

				// length defined
				args.acceptsFormat(['string', 'object'], 2)
					.should.be.false;
			});
		})

		describe('args.format(format {Array}, [keys] {Array})', function () {

			it('can create a series of cascading interfaces', function () {
				var args = this.createArgsObj(['Maria', ['jazz', 'surf'], 34]);

				// define the interfaces
				args.format(['string', 'number'], ['name', 'age'])
					.format(['string', 'array'], 2, ['name', 'hobbies'])
					.format(['string', 'array', 'number'], ['name', 'hobbies', 'age']);

				// evaluate the values
				var values = args.evaluate();

				values.should.eql({
					name: 'Maria',
					hobbies: ['jazz', 'surf'],
					age: 34
				});

			});

			it('format-less interface', function () {
				var args = this.createArgsObj([['alalala'], 'qwqweqwe', 7891]);

				// define interfaces
				args.interface(['string', 'number'], ['name', 'age'])
					.interface(['number', 'array', 'string'], ['age', 'hobbies', 'name'])
					.interface([], ['a', 'b', 'c']);

				var values = args.evaluate();

				values.should.eql({
					a: ['alalala'],
					b: 'qwqweqwe',
					c: 7891
				});
			});

			it('supports functions instead of key array', function () {
				var args = this.createArgsObj([{a: 'apple', b: 'banana'}]);

				// define interfaces
				args.interface(['object'], function (obj) { return obj; });

				args.evaluate().should.eql({
					a: 'apple',
					b: 'banana'
				});
			})
		});

		describe('args.defaults(values {Object})', function () {
			it('can define default values for the args', function () {
				var args = this.createArgsObj(['Stevao', ['skate']]);


				// define interfaces
				args.format(['string', 'number'], ['name', 'age'])
					.format(['string', 'array'], '>=2', ['name', 'hobbies', 'age'])
					.defaults({
						age: 50
					});

				var values = args.evaluate();

				values.should.eql({
					name: 'Stevao',
					hobbies: ['skate'],
					age: 50
				});


			})
		});

		describe('args.require(propNames {Object|Array})', function () {

			it('can define simple property requirements', function () {
				var args = this.createArgsObj(['Joao', ['chess', 'reading']]);

				// define interfaces
				args.interface(['string', 'array', '*'], ['name', 'hobbies', 'age'])
					.require(['age']);


				// control
				var errorThrown = false;

				try {
					args.evaluate();
				} catch (e) {
					errorThrown = true;
				}

				errorThrown.should.be.true;
			});

			it('can define type requirements', function () {

			});
		})
	});
});
