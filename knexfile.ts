// knex establish connection with the database
// enter your username and password
// don't forget to change the database name

module.exports = {

  client: 'mysql',
  connection: {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'cody'
  }
}
