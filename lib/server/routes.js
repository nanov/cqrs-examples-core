'use strict';

const { NotFoundError } = require('../shared/errors');

const async = fn => (...args) => fn(...args).catch(args[2]);

module.exports = ({ notABus }, app) => {
	const { readmodels, domain } = notABus;

	app.post('/person', async(async (req, res) => {
		res.json(await domain.hr.person().register(req.body));
	}));

	app.get('/person', async(async (req, res) => {
		res.json(await readmodels.person.asyncFind());
	}));

	app.get('/person/:id', async(async (req, res) => {
		const person = await readmodels.person.asyncFindOne({ id: req.params.id });
		if (!person)
			throw new NotFoundError();
		res.json(person);
	}));
};
