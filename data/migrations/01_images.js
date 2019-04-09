
exports.up = function(knex, Promise) {
  return knex.schema.createTable('images', tbl => {

    tbl.increments();

    tbl.string('img_url').notNullable();

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('images');
};
