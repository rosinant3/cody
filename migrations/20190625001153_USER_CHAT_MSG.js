// TABLE CREATION SOFTWARE
// made with knex migrate:make FileName, edit file name as it fits your needs
// for new knex session, create a new database
// knex is now bound to this one
// or delete migration tabels from you database
// knex migrate:latest when done

exports.up = function (knex) {
    return knex.schema.createTable('userChatMsg', function (t) {
      t.increments('id').primary();
      t.integer('chat_id').unsigned().collate('utf8_unicode_ci').notNullable();
      t.integer('user').unsigned().collate('utf8_unicode_ci').notNullable();
      t.text('msg').collate('utf8_unicode_ci').notNullable();
      t.string('seen').collate('utf8_unicode_ci').notNullable();
      t.string('deleted_by_sender').collate('utf8_unicode_ci').notNullable();
      t.string('deleted_by_recipient').collate('utf8_unicode_ci').notNullable();
      t.timestamps(false, true);
      t.foreign('user').references('id').inTable('user');
    })
  }
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('userChatMsg')
  }
