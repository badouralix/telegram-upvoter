/**
 * @file app/index.js
 *
 * @description
 * Init file.
 */

'use strict';

const waitOn = require('wait-on');
const logger = require('winston');

logger.configure({
    level: process.env.LOG_LEVEL || 'info',
    format: logger.format.combine(
        logger.format.splat(),
        logger.format.simple()
    ),
    transports: [
        new logger.transports.Console(),
    ],
});

logger.info('Waiting for database server to start');

waitOn({ resources: ['tcp:db:5432'] }, async (err) => {
    // Run migrations
    const knexconfig = require('./knexfile');
    const knex = require('knex')(knexconfig);
    logger.info('Run migrations to latest')
    await knex.migrate.latest();
    logger.info(`Current migration version: ${await knex.migrate.currentVersion()}`);

    // Start bot
    const { bot } = require('./bot');
    logger.info('Starting bot now');
    bot.startPolling();
});