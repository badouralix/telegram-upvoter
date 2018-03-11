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

    static byVotee(votee) {
        return this.forge().query({where:{ votee: votee }}).fetch();
    }
}

var vote = new Vote();
vote.set('group', 0);
vote.set('message', 0);
vote.set('voter', 0);
vote.set('votee', '@yolovotee');

vote.save().then(function(u) {
    console.log('Vote saved:', u.get('voter'));
});

Vote.byVotee('@yolovotee').then(function(u) {
    console.log('Got votee:', u.get('votee'));
});

module.exports = { bookshelf };