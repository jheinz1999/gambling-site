const knex = require('knex');

const knexConfig = require('../knexfile');
const environment = process.env.ENVIRONMENT || 'development';

const db = knex(knexConfig[environment]);

module.exports = {

  db,
  changeCash: (id, amount) => {

    return new Promise(async function(resolve, reject) {

      const user = await db.select().from('users').where({id}).first();
      console.log('cash', user.cash);
      console.log('amount', amount);
      await db('users').update({cash: user.cash + amount}).where({id});

      resolve(user.cash + amount);

    });

  }

};
