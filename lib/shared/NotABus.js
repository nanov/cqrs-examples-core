'use strict';

const EventEmitter = require('events');
const { promisify } = require('util');

const idSymbol = Symbol('command:id');

const buildAggregateClass = ({
	name: aggregateName,
	commands,
}, context, runCommand) => {
	function Aggregate(id) {
		this[idSymbol] = id;
	}

	commands.forEach(({ name }) => {
		Aggregate.prototype[name] = function commandRunner(payload = {}, metadata = {}) {
			const command = {
				name,
				aggregate: {
					name: aggregateName,
				},
				context,
				payload,
				metadata,
			};
			if (this[idSymbol])
				command.aggregate.id = this[idSymbol];
			return runCommand(command);
		};
	});
	return Aggregate;
};

const buildDomain = (domainInfo, runCommand) => {
	const domain = {};
	domainInfo.contexts.forEach(({ name: contextName, aggregates }) => {
		domain[contextName] = {};
		aggregates.forEach((aggregate) => {
			const Aggregate = buildAggregateClass(aggregate, contextName, runCommand);
			domain[contextName][aggregate.name] = id => new Aggregate(id);
		});
	});
	return domain;
};

const runCommand = domain => cmd => new Promise((resolve, reject) => domain.handle(cmd, (errors, events, agg) => {
	if (errors)
		return reject(errors);
	return resolve(agg);
}));

const buildReadmodels = (collections) => {
	const readmodels = {};
	collections.forEach(({ name, repository }) => {
		repository.asyncFind = promisify(repository.find.bind(repository));
		repository.asyncFindOne = promisify(repository.findOne.bind(repository));
		readmodels[name] = repository;
	});
	return readmodels;
};

class NotABus extends EventEmitter {
	constructor() {
		super();
		this.domain = null;
		this.readmodels = null;
	}

	registerDomain(domain) {
		this.domain = buildDomain(domain.getInfo(), runCommand(domain));
	}

	registerReadmodels(denormalizerCollections) {
		this.readmodels = buildReadmodels(denormalizerCollections);
	}

	domainEvent(event) {
		this.emit('domain:event', event);
		this.emit('event', {
			type: 'domain',
			...event,
		});
	}

	readmodelEvent(event) {
		this.emit('readmodel:event', event);
		this.emit('event', {
			type: 'readmodel',
			...event,
		});
	}
}

module.exports = NotABus;
