'use strict';

// if exports is an array, it will be the same like loading multiple files...
// module.exports = require('cqrs-domain').defineAggregate({
module.exports = require('cqrs-domain').defineAggregate({
	name: 'person', // optional, default is last part of path name
	defaultCommandPayload: '',
	defaultEventPayload: '',
});
