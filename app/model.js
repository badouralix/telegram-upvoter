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
                   .query((qb) => {
                       qb.where({ chat_id: chatId });
                       qb.groupBy('votee');
                   })
                   .fetchAll({columns: [
                       'votee',
                       knex.raw('COUNT(*) FILTER (WHERE type = \'upvote\') AS upvotes'),
                       knex.raw('COUNT(*) FILTER (WHERE type = \'downvote\') AS downvotes')
                   ]});
    }
}

module.exports = { Vote };
