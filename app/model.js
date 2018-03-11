'use strict';

const knexconfig = require('./knexfile');
const knex = require('knex')(knexconfig);
const bookshelf = require('bookshelf')(knex);

class Vote extends bookshelf.Model {
    get tableName() {
        return 'votes';
    }

    get hasTimestamps() {
        return true;
    }

    static byGroup(group) {
        return this.forge()
                   .query({ where: { group: group } })
                   .fetchAll();
    }
}

module.exports = { Vote };
