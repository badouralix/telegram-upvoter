
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('votes', (table) => {
            table.increments();
            table.integer('group');
            table.integer('message');
            table.integer('voter');
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
