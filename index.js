'use strict';

const domain = require('./lib/domain');
const denormalizer = require('./lib/readmodels');
const server = require('./lib/server');

const NotABus = require('./lib/shared/NotABus');

(async () => {
	const app = {
		notABus: new NotABus(),
		port: 3030,
	};

	await domain(app);
	await denormalizer(app);
	await server(app);
})();
