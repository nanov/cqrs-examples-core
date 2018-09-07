'use strict';

module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
	name: 'registered', // optional, default is file name without extension, if name is '' it will handle all events that matches
	aggregate: 'person', // optional
	context: 'hr', // optional
	id: 'aggregate.id', // if not defined or not found it will generate a new viewmodel with new id
	payload: '',
}, ({ payload }, vm) => { // instead of function you can define a string with default handling ('create', 'update', 'delete')
	vm.set(payload);
});
