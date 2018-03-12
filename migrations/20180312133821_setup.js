
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('votes', (table) => {
            table.increments();
            table.integer('chat_id').notNullable();
            table.integer('message_id').notNullable();
            table.integer('voter_id').notNullable();
            table.string('votee').notNullable();
            table.timestamps();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('votes'),
    ]);
};
