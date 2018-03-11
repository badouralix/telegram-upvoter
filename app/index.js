'use strict';

const waitOn = require('wait-on');

console.log('Waiting for database server to start');

waitOn({ resources: ['tcp:db:5432'] }, async (err) => {
    const knexconfig = require('./knexfile');
    const knex = require('knex')(knexconfig);

    await knex.migrate.latest();

    const { bot } = require('./bot');

    // Start bot
    console.log('Starting bot now');
    bot.startPolling();
});