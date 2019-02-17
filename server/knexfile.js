// Update with your config settings.

const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://yiocnxwvkmnchf:59260ee7cec582780aded5994b1050b6d106b3e053a3603071474ad07e13966f@ec2-54-83-17-151.compute-1.amazonaws.com:5432/d6rcljnlm8p7h4',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  }

};
