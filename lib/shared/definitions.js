'use strict';

module.exports = {
	command: {
		id: 'id',
		context: 'context',
		// aggregate
		aggregateId: 'aggregate.id',
		aggregate: 'aggregate.name',
		revision: 'aggregate.revision',

		name: 'name',
		payload: 'payload',

		meta: 'metadata',
	},
	eventNotification: {
		id: 'id', // uniquie id of the notification type uid
		context: 'context', // context name type String

		// aggregate info
		aggregateId: 'aggregate.id',
		aggregate: 'aggregate.name',
		revision: 'aggregate.revision',

		// event
		event: 'event.name', // event
		eventId: 'event.id', // event

		// readmodel
		collection: 'readmodel.collection',

		// name
		name: 'name', // create, update, delete

		payload: 'payload',

		// metadata
		meta: 'metadata',
		commitStamp: 'metadata.timestamp',
		correlationId: 'metadata.correlationId',
		causationId: 'metadata.causationId',
	},
};
