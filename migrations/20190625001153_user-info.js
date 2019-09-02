// TABLE CREATION SOFTWARE
// made with knex migrate:make FileName, edit file name as it fits your needs
// for new knex session, create a new database
// knex is now bound to this one
// or delete migration tabels from you database
// knex migrate:latest when done

exports.up = function (knex) {
    return knex.schema.createTable('userInfo', function (t) {
      t.increments('id').primary();
      t.integer('user').unsigned().collate('utf8_unicode_ci').notNullable();
      t.string('first_name').collate('utf8_unicode_ci').notNullable();
      t.string('last_name').collate('utf8_unicode_ci').notNullable();
      t.string('location').collate('utf8_unicode_ci').notNullable();
      t.timestamps(false, true)
      t.foreign('user').references('id').inTable('user');
    })
  }
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('userInfo')
  }
