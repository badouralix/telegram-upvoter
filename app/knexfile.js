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
		host:     'db',
		database: 'telegram_upvoter',
		user:     'postgres',
		password: 'securepassword'
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