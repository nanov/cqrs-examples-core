'use strict';

const countries = require('i18n-iso-countries');

module.exports = {
	name: 'ISO-3166-2',
	options: {
		async: true,
		type: 'string',
		validate: country => !(!countries.getName(country, 'en')),
	},
};
