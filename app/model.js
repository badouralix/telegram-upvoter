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

    static byChatId(chatId) {
        return this.forge()
                   .query({ where: { chat_id: chatId } })
                   .fetchAll();
    }
}

module.exports = { Vote };
