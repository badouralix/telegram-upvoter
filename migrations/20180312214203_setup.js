
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('votes', (table) => {
            table.bigInteger('chat_id').notNullable().alter();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('votes', (table) => {
            table.integer('chat_id').notNullable().alter();
        }),
    ]);
};
