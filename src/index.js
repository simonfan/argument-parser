//     argument-parser
//     (c) simonfan
//     argument-parser is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module argument-parser
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash'),
		subject = require('subject');

	/**
	 * @class parser
	 * @constructor
	 */
	var parser = subject(function parser(args) {
		this.arguments = args;
		this.args = Array.prototype.slice.call(args);

		/**
		 * This is where format objects are stored.
		 *
		 * @property _formats
		 * @private
		 */
		this._formats = [];

		/**
		 * this is where the param names are stored
		 * @property _interfaces
		 * @private
		 */
		this._interfaces = [];

		/**
		 * The name of the interface.
		 * Useful when throwing errors.
		 * @property name
		 */
		this.name = '';


		this._required = {};

		this._defaults = {};
	});

	/**
	 * Proto
	 */
	parser.proto(require('./__argument-parser/format'));
	parser.proto(require('./__argument-parser/evaluate'));

	parser.proto({
		require: function (props) {

			var required = {};

			if (_.isArray(props)) {
				_.each(props, function (p) {
					required[p] = '!undefined';
				});
			} else {
				required = props;
			}

			_.extend(this._required, required);

			return this;
		},

		defaults: function defaults(df) {
			_.extend(this._defaults, df);

			return this;
		},

		error: function (message) {
			throw new Error('Interface - ' + this.name + ' ' + message);
		}
	});

	return parser;
});
