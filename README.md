# argument-parser[![Build Status](https://secure.travis-ci.org/simonfan/argument-parser.png?branch=master)](http://travis-ci.org/simonfan/argument-parser)

``` javascript
var parser = require('argument-parser');

function depFileNames() {
	
	// parse out arguments
	var args = parser(arguments);

	if (args.hasFormat(['string', 'object', 'array'])) {

	} else if (args.hasFormat(['object', 'array'])) {

	}


	args.format(['string', 'object', 'array'], ['name', 'data', 'hobbies'])
		.format(['string', 'array'], ['name', 'hobbies'])
		.format(['object'], ['data'])
		.defaults({
		//	name: 'Someone',
			data: {
				age: 'allalalaa'
			},
			hobbies: ['jazz', 'surf']
		})
		.require(['name']);

	args = args.evaluate();	// { name, data, hobbies }

};

```
