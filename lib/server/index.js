'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');

const errorMiddleware = (err, req, res, next) => {
	res.status(err.statusCode || 500);
	const error = {};
	error.code = err.errorCode;
	error.message = err.message;
	error.param = err.toJson ? err.toJson() : null;
	error.stack = err.stack;
	res.json({ error });
	next();
};

module.exports = app => new Promise((resolve, reject) => {
	const exApp = express();

	exApp.use(cors({ exposedHeaders: 'x-total-count' }));
	exApp.use(bodyParser.urlencoded({ extended: true }));
	exApp.use(bodyParser.json());

	routes(app, exApp);

	exApp.use((req, res) => res.status(404).send());
	exApp.use(errorMiddleware);

	const httpServer = http.Server(exApp);
	const port = app.port || 3030;
	httpServer.listen(port, (err) => {
		if (err)
			return reject(err);
		console.log(`please open http://localhost:${port}`);
		console.log(`Node ${process.version}, NODE_ENV: ${process.env.NODE_ENV}`);
		return resolve(httpServer);
	});
});
