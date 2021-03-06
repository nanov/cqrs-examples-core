'use strict';

const fs = require('fs');

const loader = require('./loader');
const builder = require('./builder');


class ValidationService {
	constructor({ validation }) {
		if (!validation)
			throw new Error('No validation definitions supplied.');

		if (typeof validation === 'string')
			validation = loader(validation);

		this._validation = validation;
		this.ajv = builder(this._validation, {
			loadSchema: async uri => this.loadSchema(uri),
			allErrors: true,
			extendRefs: true,
			errorDataPath: 'property',
			unknownFormats: 'ignore',
			useDefaults: 'true',
			format: 'full',
			multipleOfPrecision: 4, // this is needed because integer division is not precise
		});
	}

	loadSchema(uri) {
		if (!uri.startsWith('/'))
			uri = `/${uri}`;

		if (this._validation.schemas[uri])
			return JSON.parse(fs.readFileSync(this._validation.schemas[uri].path));
		throw new Error(`Schema ${uri} not found!`);
	}

	async getValidatorFunction(schema) {
		if (typeof schema === 'string')
			schema = this.loadSchema(schema);
		return this.ajv.compileAsync(schema);
	}

	async validate(schema, data) {
		const fn = await this.getValidatorFunction(schema);
		return fn(data);
	}
}

ValidationService.loader = loader;

module.exports = ValidationService;
