/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash'),
		isType = require('./types');

	var numberCompare = {
		'>': function (a, b) {
			return a > b;
		},
		'>=': function (a, b) {
			return a >= b;
		},
		'<': function (a, b) {
			return a < b;
		},
		'<=': function (a, b) {
			return a <= b;
		}
	};

	/**
	 * All this method does is to convert arguments
	 * into a well behaved data hash object.
	 *
	 * @method formatObject
	 * @private
	 * @param types
	 * @param length
	 */
	function formatObject(first, second) {

		var f = {};

		if (!second) {
			if (_.isArray(first)) {
				f.types = first;
			} else {
				f.length = first;
			}
		} else {
			// arguments.length === 2
			f.types = first;

			if (_.isNumber(second) || _.isString(second)) {
				f.length = second;
			}
		}

		return f;
	}

	/**
	 * @method format
	 * @param [interface] {Array|Function}
	 *     Array of argument types.
	 * @param [length] {Number}
	 *     Optionally define the arguments length.
	 * @param interface {Array}
	 *     An array of parameter names that should
	 *     correspond to the arguments.
	 */
	exports.format = function format(first, second, third) {

		// [1] build up a format object,
		//     which consists of: { types, [length] }
		var f = formatObject(first, second);

		if (arguments.length === 2) {

			this._formats.push(f);
			this._interfaces.push(second);

		} else if (arguments.length === 3) {

			this._formats.push(f);
			this._interfaces.push(third);

		}

		return this;
	};

	/**
	 * @method acceptsFormat
	 * @param types {Array}
	 * @param [length]
	 */
	exports.acceptsFormat = function acceptsFormat(first, second) {

		// parse arguments
		var format = _.isPlainObject(first) ? first : formatObject(first, second);

		if (format.length) {

			return this.acceptsLength(format.length) && this.acceptsTypes(format.types);
		} else {

			return this.acceptsTypes(format.types);
		}
	};


	/**
	 * @method acceptsTypes
	 * @param types {Array}
	 */
	exports.acceptsTypes = function acceptsTypes(types) {
		return _.every(types, _.bind(function (type, index) {

			type = type.split('|');

			return _.any(type, _.partial(isType, this.arguments[index]));

		}, this));
	};

	/**
	 * @method acceptsLength
	 * @param length {Number}
	 */
	exports.acceptsLength = function acceptsLength(length) {
		if (_.isNumber(length)) {
			// simple number comparison
			return this.arguments.length === length;

		} else if (_.isString(length)) {

			var comparison = length.match(/^(>=|>|<=|<)/)[0];

			length = parseInt(length.replace(comparison, ''));

			return numberCompare[comparison](this.arguments.length, length);
		}
	};

	/**
	 * Some nice looking aliases
	 */
	exports.interface = exports.format;
	exports.acceptsInterface = exports.acceptsFormat;
});
