const knex = require('knex');

const knexConfig = require('../knexfile');
const environment = process.env.ENVIRONMENT || 'development';

const db = knex(knexConfig[environment]);

module.exports = db;
