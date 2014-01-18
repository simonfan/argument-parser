/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash'),
		isType = require('./types');


	exports.findInterface = function findInterface() {
		// [1] retrieve index of the FIRST VALID FORMAT.
		var iIndex = _.findIndex(this._formats, _.bind(this.acceptsFormat, this));

		// [2] call error method if no interface was found
		if (!_.isNumber(iIndex)) {
			this.error('No interface was found');
		}

		// [3] retrieve interface that corresponds to the given format.
		return this._interfaces[iIndex];
	};

	exports.evaluate = function evaluate() {

		// [1] get the interface
		var interf = this.findInterface();

		// [2] build a response object using the interface and the values.
		//     if interface is an array, it contains the argument names
		//     if it is a function, it returns the response object
		var res = _.isArray(interf) ? _.zipObject(interf, this.args) : interf.apply(this, this.args);

		// [3] set the default values.
		if (this._defaults) {
			_.defaults(res, this._defaults);
		}

		// [4] check for required parameters
		if (_.size(this._required) > 0) {
			_.each(this._required, function (type, key) {

				if (!isType(res[key], type)) {
					throw new Error(key + ' is required.');
				}
			});
		}

		// [5] finally return the object
		return res;
	};
});
