/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 * Hash containing lodash's `is{something}` methods,
	 * keyed by `sometinhg`
	 */
	var types = {
		arguments: _.isArguments,
		array: _.isArray,
		'boolean': _.isBoolean,
		bool: _.isBoolean,			// alias
		date: _.isDate,
		element: _.isElement,
		empty: _.isEmpty,
		finite: _.isFinite,
		'function': _.isFunction,
		'nan': _.isNaN,
		'null': _.isNull,
		number: _.isNumber,
		object: _.isObject,
		plainobject: _.isPlainObject,
		regexp: _.isRegExp,
		string: _.isString,
		'undefined': _.isUndefined,
		'*': function () { return true; }
	};

	var negative = /^!/;

	module.exports = function isType(val, type) {
		// check if is negative pattern
		if (negative.test(type)) {
			type = type.replace(negative, '');

			return !types[type](val);
		} else {
			return types[type](val);
		}
	};
});
