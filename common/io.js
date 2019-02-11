const jwt = require('jsonwebtoken');
const server = require('../server');
const io = require('socket.io')(server);

const { jwtKey } = require('./authentication');

const PokerRoom = require('../rooms/PokerRoom');
const rooms = [];

function start() {

  console.log('started?');

  io.on('connection', socket => {

    console.log('connected?');

    socket.emit('loginReq');

    socket.on('loginRes', data => {

      jwt.verify(token, jwtKey, (err, user) => {

        if (err) {

          socket.emit('loginFailure');

        }

        else {

          socket.emit('loginSuccess');

          socket.on('loginAck', data => {

            socket.on('createRoom', room => {

              if (rooms.indexOf(room) === -1) {

                socket.emit('error', 'room exists!');

              }

              else {

                socket.join(room);
                rooms.push(new PokerRoom(room, user));

              }

            });

            socket.on('joinRoom', room => {

              socket.join(room);

            });

          });

        }

      });

    });

  });

}

module.exports = {

  start,
  io

}
