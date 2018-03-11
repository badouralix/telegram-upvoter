
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('votes', (table) => {
            table.increments();
            table.integer('chat_id');
            table.integer('message_id');
            table.integer('voter_id');
            table.string('votee');
            table.timestamps();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('votes')
    ]);
};
