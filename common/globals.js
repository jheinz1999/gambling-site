const jwt = require('jsonwebtoken');
const { jwtKey } = require('./authentication');

let io = undefined;

const setIO = newIO => {

  io = newIO;

}

const getIO = () => io;

const checkToken = token => {

  return new Promise(function(resolve, reject) {

    jwt.verify(token, jwtKey, (err, user) => {

      if (err)
        resolve(null);

      else
        resolve(user);

    });

  });

}


module.exports = {

  getIO,
  setIO,
  checkToken

}
