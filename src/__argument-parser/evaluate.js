/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash'),
		isType = require('./types');

	exports.evaluate = function evaluate() {

		// [1] retrieve index of the FIRST VALID FORMAT.
		var iIndex;

		// use 'every' loop so that we can break out from it
		_.every(this._formats, _.bind(function (format, index) {

			if (this.acceptsFormat(format)) {

				iIndex = index;
				// break.
				return false;
			} else {
				// keep on..
				return true;
			}

		}, this));

		// [2] call error method if no interface was found
		if (!_.isNumber(iIndex)) {
			this.error('No interface was found');
		}

		// [3] retrieve interface that corresponds to the given format.
		var i = this._interfaces[iIndex];

		// [4] build a response object using the interface and the values.
		var res = _.zipObject(i, this.args);

		// [5] set the default values.
		if (this._defaults) {
			_.defaults(res, this._defaults);
		}

		// [6] check for required parameters
		if (_.size(this._required) > 0) {
			_.each(this._required, function (type, key) {

				if (!isType(res[key], type)) {
					throw new Error(key + ' is required.');
				}
			});
		}

		// [7] finally return the object
		return res;
	};
});
