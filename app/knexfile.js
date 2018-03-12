/**
 * @file app/knexfile.js
 *
 * @description
 * Knex config file. See tutorial:
 * https://alexzywiak.github.io/running-migrations-with-knex/index.html.
 *****************************************************************************/

'use strict';

module.exports = {

	client: 'postgresql',
	connection: {
		host:     process.env.POSTGRES_HOST,
		database: process.env.POSTGRES_DB,
		user:     process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
	},
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		directory: '../migrations',
		tableName: 'knex_migrations'
	},

};