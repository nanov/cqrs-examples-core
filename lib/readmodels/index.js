'use strict';

const path = require('path');
const cqrsDenormalizer = require('cqrs-eventdenormalizer');
const { promisify } = require('util');

const { eventNotification: eventDefinition } = require('../shared/definitions');

const denormalizer = cqrsDenormalizer({
	denormalizerPath: path.join(__dirname, 'readmodels'),
}).defineEvent(eventDefinition).defineNotification(eventDefinition);

const denormalizerInit = promisify(denormalizer.init.bind(denormalizer));

module.exports = async (app) => {
	await denormalizerInit();
	app.notABus.registerReadmodels(denormalizer.tree.getCollections());
	denormalizer.onNotification(notification => app.notABus.readmodelEvent(notification));
	app.notABus.on('domain:event', evt => denormalizer.handle(evt));
	return denormalizer;
};
