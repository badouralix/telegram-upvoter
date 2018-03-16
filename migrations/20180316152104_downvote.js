/**
 * See http://perkframework.com/v1/guides/database-migrations-knex.html
 *****************************************************************************/

exports.up = function(knex, Promise) {
    return knex.schema.table('votes', (table) => {
        table.enu('type', ['upvote', 'downvote']).notNullable().defaultTo('upvote');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('votes', (table) => {
        table.dropColumn('type');
    });
};
