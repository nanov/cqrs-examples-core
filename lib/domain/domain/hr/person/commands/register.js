'use strict';

// if exports is an array, it will be the same like loading multiple files...
module.exports = require('cqrs-domain').defineCommand({
	name: 'register', // optional, default is file name without extension
}, ({ payload }, aggregate) => {
	aggregate.apply('registered', payload);
});
