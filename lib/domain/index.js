'use strict';

const path = require('path');
const cqrsDomain = require('cqrs-domain');
const { promisify } = require('util');

const { command: commandDefinition, eventNotification: eventDefinition } = require('../shared/definitions');
const { ValidationError } = require('../shared/errors');

const ValidationService = require('../shared/ValidationService');

const validationService = new ValidationService({
	validation: path.join(process.cwd(), './lib/validation'),
});


const domain = cqrsDomain({
	domainPath: path.join(__dirname, 'domain'),
})
	.defineCommand(commandDefinition)
	.defineEvent(eventDefinition)
	.extendValidator(
		validator => validator.validator((_, schema) => ({ payload }, callback) => validationService.validate(schema, payload).then(() => callback(), e => callback(ValidationError.formAjvError(e.errors)))),
	);

const domainInit = promisify(domain.init.bind(domain));

module.exports = async (app) => {
	await domainInit();
	domain.onEvent(evt => app.notABus.domainEvent(evt));
	app.notABus.registerDomain(domain);
	return domain;
};
